import { z } from "zod";

export const QueryValidator = z.object({
  category: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(), // define these two vars
  limit: z.number().optional(),
});

export type TQueryValidator = z.infer<typeof QueryValidator>;
