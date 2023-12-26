import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from ".";

// Generic will hold the entirity of our backend
export const trpc = createTRPCReact<AppRouter>({});
