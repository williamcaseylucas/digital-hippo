import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import nextBuild from "next/dist/build";
import path from "path";
import dotenv from "dotenv";
import { PayloadRequest } from "payload/types";
import { parse } from "url";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = Number(process.env.PORT) || 3000;
console.log("PORT: ", process.env.PORT);

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

// to add type safety to createContext which will be used for cookie storage -> also need to add to trpc.ts
export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        // localhost:3000/cell or vercel.app/cell
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  // protect cart page to only be accessible to users who are authenticated
  const cartRouter = express.Router();
  cartRouter.use(payload.authenticate); // attaches user object from payload to our express app

  cartRouter.get("/", (req, res) => {
    // get user
    const request = req as PayloadRequest;

    if (!request.user) return res.redirect("/sign-in?origin=cart");

    const parsedUrl = parse(req.url, true);

    return nextApp.render(req, res, "/cart", parsedUrl.query); // what to render when user is authenticated
  });

  app.use("/cart", cartRouter);

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production");

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"), { debugOutput: true });

      process.exit();
    });

    return;
  }

  // Forward to trpc and add context for Next.js
  app.use(
    `/api/trpc`,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Can now use things like websockets that Vercel cannot give us
  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");
    // NEXT_PUBLIC_
    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
