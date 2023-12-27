import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

// to add type safety to createContext which will be used for cookie storage -> also need to add to trpc.ts
export type ExpressContext = inferAsyncReturnType<typeof createContext>;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        // localhost:3000/cell or vercel.app/cell
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

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

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
