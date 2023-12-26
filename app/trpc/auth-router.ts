import { AuthCredentialValidator } from "@/lib/validators/account-credentials-validator";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      // Check if user already exists
    }),
});
