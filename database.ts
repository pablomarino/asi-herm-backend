import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { Item, Box, Order } from "./models.ts"

const mongoHost = Deno.env.get("MONGO_HOST") || "0.0.0.0";
const mongoPort = Deno.env.get("MONGO_PORT") || "27017";

const URI = `mongodb://${mongoHost}:${mongoPort}`;
// Mongo Connection Init
const client = new MongoClient();
try {
  await client.connect(URI);
  console.log("Database successfully connected");
} catch (err) {
  console.log(err);
}
const db = client.database("App");

const items = db.collection<Item>("items");
const boxes = db.collection<Box>("boxes");
const orders = db.collection<Order>("orders");

export { items, boxes, orders}
