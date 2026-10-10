import { toNextJsHandler } from "better-auth/next-js";
import { auth, connectMongo } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

export async function GET(...args) {
  await connectMongo();
  return handlers.GET(...args);
}

export async function POST(...args) {
  await connectMongo();
  return handlers.POST(...args);
}
