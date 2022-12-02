import { MongoClient } from "./deps.js";

const MONGO_URL = Deno.env.get("MONGO_URL");

const client = new MongoClient();
await client.connect(MONGO_URL);

const db = client.database("denotest");

export default db;
