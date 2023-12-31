import { TRPCError, initTRPC } from "@trpc/server";
import { ExpressContext } from "../server";
import { PayloadRequest } from "payload/types";
import { User } from "../payload-types";

// Taken from server.ts
const t = initTRPC.context<ExpressContext>().create();

// For private routes
const middleware = t.middleware;
const isAuth = middleware(async ({ ctx, next }) => {
  const req = ctx.req as PayloadRequest;

  const { user } = req as { user: User | null };

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // We can use 'user' in payment-router.ts because we attach it here
  return next({
    ctx: {
      user,
    },
  });
});

export const router = t.router;
// everything everyone should be able to access
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
