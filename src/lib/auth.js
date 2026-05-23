import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is required for Better Auth.");
}

let betterAuthClient;

if (process.env.NODE_ENV === "development") {
  if (!global._betterAuthMongoClient) {
    global._betterAuthMongoClient = new MongoClient(uri);
  }

  betterAuthClient = global._betterAuthMongoClient;
} else {
  betterAuthClient = new MongoClient(uri);
}

const db = betterAuthClient.db(process.env.MONGODB_DB || "doctor_manager");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: betterAuthClient,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
});
