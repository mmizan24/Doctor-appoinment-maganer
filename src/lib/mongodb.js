import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is required.");
}

let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._doctorManagerMongoClientPromise) {
    const client = new MongoClient(uri);
    global._doctorManagerMongoClientPromise = client.connect();
  }

  clientPromise = global._doctorManagerMongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export const getDb = async () => {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "doctor_manager");
};
