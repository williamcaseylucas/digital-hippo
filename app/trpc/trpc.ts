import { initTRPC } from "@trpc/server";

const t = initTRPC.context().create();
export const router = t.router;
// everything everyone should be able to access
export const publicProcedure = t.procedure;
