import { MongoClient } from "./deps.js";

const MONGO_URL = `mongodb+srv://deno:Zoggoz123!@denotest.urlqjo0.mongodb.net/test?authMechanism=SCRAM-SHA-1`;

const client = new MongoClient();
await client.connect(MONGO_URL);

const db = client.database("denotest");

export default db;
