import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  getItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
} from "./controllers/items.ts";
import {
  getOrders,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
} from "./controllers/orders.ts";
import {
  getBoxes,
  getBox,
  addBox,
  updateBox,
  deleteBox,
} from "./controllers/boxes.ts";

import {
  check
} from "./controllers/check.ts"

const router = new Router();

router
  .get("/api/items", getItems)
  .get("/api/items/:id", getItem)
  .post("/api/items", addItem)
  .put("/api/items/:id", updateItem)
  .delete("/api/items/:id", deleteItem)

  .get("/api/boxes", getBoxes)
  .get("/api/boxes/:id", getBox)
  .post("/api/boxes", addBox)
  .put("/api/boxes/:id", updateBox)
  .delete("/api/boxes/:id", deleteBox)

  .get("/api/orders", getOrders)
  .get("/api/orders/:id", getOrder)
  .post("/api/orders", addOrder)
  .put("/api/orders/:id", updateOrder)
  .delete("/api/orders/:id", deleteOrder)

  .get("/healhz", check);

export default router;
