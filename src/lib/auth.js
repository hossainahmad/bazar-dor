import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bazar-dor";
const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const globalForMongo = globalThis;
const mongoClient =
  globalForMongo.bazarDorMongoClient || new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.bazarDorMongoClient = mongoClient;
}

let mongoClientPromise = globalForMongo.bazarDorMongoClientPromise;

export function connectMongo() {
  if (!mongoClientPromise) {
    mongoClientPromise = mongoClient.connect().catch((error) => {
      mongoClientPromise = undefined;
      if (process.env.NODE_ENV !== "production") {
        globalForMongo.bazarDorMongoClientPromise = undefined;
      }
      throw error;
    });

    if (process.env.NODE_ENV !== "production") {
      globalForMongo.bazarDorMongoClientPromise = mongoClientPromise;
    }
  }

  return mongoClientPromise;
}

const database = mongoClient.db();
const secret = process.env.BETTER_AUTH_SECRET;

if (process.env.NODE_ENV === "production") {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set in production.");
  }
  if (!secret) {
    throw new Error("BETTER_AUTH_SECRET must be set in production.");
  }
  if (!process.env.BETTER_AUTH_URL) {
    throw new Error("BETTER_AUTH_URL must be set in production.");
  }
}

export const auth = betterAuth({
  database: mongodbAdapter(database, { client: mongoClient }),
  baseURL,
  secret: secret || "development-only-secret-do-not-use-in-production-32",
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
  },
});
