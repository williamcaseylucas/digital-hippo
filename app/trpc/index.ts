import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  auth: authRouter,
});

// type of our backend
export type AppRouter = typeof appRouter;
