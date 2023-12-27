import { initTRPC } from "@trpc/server";
import { ExpressContext } from "../server";

// Taken from server.ts
const t = initTRPC.context<ExpressContext>().create();
export const router = t.router;
// everything everyone should be able to access
export const publicProcedure = t.procedure;
