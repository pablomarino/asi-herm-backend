import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { Item, Box, Order } from "./models.ts"

const URI = "mongodb://127.0.0.1:27017";

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
