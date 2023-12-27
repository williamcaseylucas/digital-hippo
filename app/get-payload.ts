import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import { InitOptions } from "payload/config";

// go from /app to main folder and then go to .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

let cached = (global as any).payload;

// If we don't have a cache of our CMS
if (!cached) {
  cached = (global as any).payload = { client: null, promise: null };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  // Ensures JWT Token exists
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }

  if (cached.client) return cached.client;

  if (!cached.promise)
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });

  try {
    cached.client = await cached.promise;
  } catch (expection: unknown) {
    cached.promise = null;
    throw expection;
  }

  return cached.client;
};
