import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let client: MongoClient;
let db: Db;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to prevent multiple connections during hot reloads
  if (!(global as any)._mongoClient) {
    client = new MongoClient(uri);
    (global as any)._mongoClient = client.connect();
  }
  client = new MongoClient(uri);
  db = (await (global as any)._mongoClient).db("random_bracket_db");
} else {
  // In production, create a new client for each connection
  client = new MongoClient(uri);
  db = client.db("random_bracket_db");
}

export async function getDb(): Promise<Db> {
  if (!db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("random_bracket_db");
  }
  return db;
}
