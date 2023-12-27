import { authRouter } from "./auth-router";
import { router } from "./trpc";

// Where we bind 'auth' to 'authRouter'
export const appRouter = router({
  auth: authRouter,
});

// type of our backend
export type AppRouter = typeof appRouter;
