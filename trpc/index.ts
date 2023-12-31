import { z } from "zod";
import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { QueryValidator } from "../lib/validators/query-validators";
import { getPayloadClient } from "../get-payload";
import { paymentRouter } from "./payment-router";

// Where we bind 'auth' to 'authRouter'
export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(), // last element that was rendered (accepts null)
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      // This is defined by our input above
      const { query, cursor } = input;
      const { sort, limit, ...queryOpts } = query; // put all other vals to queryOpts

      const payload = await getPayloadClient();

      const parsedQueryOpts: Record<string, { equals: string }> = {};

      // has just category for now, doing this to make it mimick look of 'approvedForSale' structure
      Object.entries(queryOpts).forEach(([key, val]) => {
        parsedQueryOpts[key] = {
          equals: val,
        };
      });

      const page = cursor || 1;

      //   ...parsedQueryOpts, // category: string
      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
        },
        sort,
        depth: 1,
        limit,
        page,
      });

      // console.log("these are the items! ", items);
      // console.log("these are the items! ", items[0].id);

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});

// type of our backend
export type AppRouter = typeof appRouter;
