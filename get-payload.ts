import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import { InitOptions } from "payload/config";
import nodemailer from "nodemailer";

// Where we create CMS instance

// go from /app to main folder and then go to .env
// { path: path.resolve(__dirname, "../.env") }
dotenv.config();

// console.log(path.resolve(__dirname));
// console.log(path.resolve(__dirname, "../.env"));
// console.log(path.resolve(__dirname));
// console.log(process.env.RESEND_API_KEY);
// console.log(process.env.PAYLOAD_SECRET);
// console.log(process.env);

// get emails
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

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
  // console.log("payloadsecret", process.env.PAYLOAD_SECRET);
  // Ensures JWT Token exists
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }

  if (cached.client) return cached.client;

  if (!cached.promise)
    cached.promise = payload.init({
      email: {
        transport: transporter,
        // Can only use the email you signed up with for this, add your own custom instead
        fromAddress: "onboarding@resend.dev",
        fromName: "DigitalHippo",
      },
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
