import { z } from "zod";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { stripe } from "../../lib/stripe";
import type Stripe from "stripe";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      console.log("user: ", user);
      console.log("input: ", input);

      let { productIds } = input;

      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const payload = await getPayloadClient();

      // grab all of the products where their id's are in the productId's
      // We programatically assigned the priceId and stripeId in /Products collection
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // only products with product ids
      const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

      const order = await payload.create({
        collection: "orders",
        data: {
          isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id,
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      // We wouldn't be able to create this if we didn't programmtically add in priceId with Products collection
      filteredProducts.forEach((prod) => {
        line_items.push({
          price: prod.priceId!,
          quantity: 1,
        });
      });

      // Create line_item in stripe dashboard with "transaction" fee of $1
      line_items.push({
        price: "price_1OSt9QAdpwtORunoZ3Zw7Uxc",
        quantity: 1,
        adjustable_quantity: {
          // don't allow multiple transaction fees
          enabled: false,
        },
      });

      // Checkout session -> then go to /Products.ts to see further implementation with hooks
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`, // have them try again
          payment_method_types: ["card"], // have to activate account first "paypal"
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items: line_items,
        });

        // Will be used in Cart-page.tsx
        return { url: stripeSession.url };
      } catch (error) {
        console.log(error);

        return { url: null };
      }
    }),
});
