import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

interface Item {
  _id: { $oid: string };
  name: string;
  reference: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
}

interface Box {
  _id: { $oid: string };
  reference: string;
  size: string;
  location: string;
  itemReference: string; // Referencia a Item
}

interface OrderItem {
  itemReference: string; // Referencia a Item
  numberItems: number; // Cantidad de items
}

interface Order {
  _id: { $oid: string };
  reference: string;
  date: Date;
  state: string;
  items: OrderItem[]; // Array de OrderItem
}

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

// DESC: GET all Items
// METHOD GET /api/items
const getItems = async ({ response }: { response: any }) => {
  try {
    // Find all items and convert them into an Array
    const allItems = await items.find({}).toArray();
    console.log(allItems);
    if (allItems) {
      response.status = 200;
      response.body = {
        success: true,
        data: allItems,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Internal Server Error",
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: GET single item
// METHOD: GET /api/items/:id
const getItem = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  // Searches for a particular item in the DB
  const item = await items.findOne({ reference: params.id });
  // If found, respond with the item. If not, respond with a 404
  if (item) {
    response.status = 200;
    response.body = {
      success: true,
      data: item,
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No item found",
    };
  }
};

// DESC: ADD single item
// METHOD: POST /api/items
const addItem = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    // If the request has no Body, it will return a 400
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      // Otherwise, it will try to insert
      // a item in the DB and respond with 201
      const body = await request.body();
      const item = await body.value;

      const exists = await items.findOne({ reference: item.reference });
      if (exists) {
        response.status = 400;
        response.body = {
          success: false,
          msg: "Item with the same reference already exists",
        };
      } else {
        await items.insertOne(item);
        response.status = 201;
        response.body = {
          success: true,
          data: item,
        };
      }
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: UPDATE single item
// METHOD: PUT /api/item/:id
const updateItem = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    // Search a item in the DB and update with given values if found
    const body = await request.body();
    const inputItem = await body.value;
    await items.updateOne(
      { reference: params.id },
      {
        $set: {
          name: inputItem.name,
          description: inputItem.description,
          purchasePrice: inputItem.purchasePrice,
          salePrice: inputItem.salePrice,
        },
      }
    );
    // Respond with the Updated Item
    const updatedItem = await items.findOne({ reference: params.id });
    response.status = 200;
    response.body = {
      success: true,
      data: updatedItem,
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: DELETE single item
// METHOD: DELETE /api/items/:id
const deleteItem = async ({
  params,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    // Search for the given item and drop it from the DB
    await items.deleteOne({ reference: params.id });
    response.status = 201;
    response.body = {
      success: true,
      msg: "Item deleted",
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

const boxes = db.collection<Box>("boxes");

// DESC: GET all Boxes
// METHOD GET /api/boxes
const getBoxes = async ({ response }: { response: any }) => {
  try {
    // Find all boxes and convert them into an Array
    const allBoxes = await boxes.find({}).toArray();
    console.log(allBoxes);
    if (allBoxes) {
      response.status = 200;
      response.body = {
        success: true,
        data: allBoxes,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Internal Server Error",
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: GET single box
// METHOD: GET /api/boxes/:id
const getBox = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  // Searches for a particular box in the DB
  const box = await boxes.findOne({ reference: params.id });
  // If found, respond with the box. If not, respond with a 404
  if (box) {
    response.status = 200;
    response.body = {
      success: true,
      data: box,
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No box found",
    };
  }
};

// DESC: ADD single box
// METHOD: POST /api/boxes
const addBox = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    // If the request has no Body, it will return a 400
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      // Otherwise, it will try to insert
      // a box in the DB and respond with 201
      const body = await request.body();
      const box: Box = await body.value;

      const exists = await boxes.findOne({ reference: box.reference });
      const existItem = await items.findOne({ reference: box.itemReference });
      if (exists) {
        response.status = 400;
        response.body = {
          success: false,
          msg: "Box with the same reference already exists",
        };
      } else if (!existItem) {
        response.status = 400;
        response.body = {
          success: false,
          msg: "Referenced item not exists",
        };
      } else {
        await boxes.insertOne(box);
        response.status = 201;
        response.body = {
          success: true,
          data: box,
        };
      }
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: UPDATE single box
// METHOD: PUT /api/boxes/:id
const updateBox = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    // Search a box in the DB and update with given values if found
    const body = await request.body();
    const inputBox: Box = await body.value;

    const existItem = await items.findOne({
      reference: inputBox.itemReference,
    });
    if (!existItem) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "Referenced item not exists",
      };
    } else {
      await boxes.updateOne(
        { reference: params.id },
        {
          $set: {
            size: inputBox.size,
            location: inputBox.location,
            itemReference: inputBox.itemReference,
          },
        }
      );
      // Respond with the Updated Box
      const updatedBox = await boxes.findOne({ reference: params.id });
      response.status = 200;
      response.body = {
        success: true,
        data: updatedBox,
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: DELETE single box
// METHOD: DELETE /api/boxes/:id
const deleteBox = async ({
  params,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    // Search for the given box and drop it from the DB
    await boxes.deleteOne({ reference: params.id });
    response.status = 201;
    response.body = {
      success: true,
      msg: "Box deleted",
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

const orders = db.collection<Order>("orders");

// DESC: GET all Orders
// METHOD GET /api/orders
const getOrders = async ({ response }: { response: any }) => {
  try {
    // Find all orders and convert them into an Array
    const allOrders = await orders.find({}).toArray();
    console.log(allOrders);
    if (allOrders) {
      response.status = 200;
      response.body = {
        success: true,
        data: allOrders,
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        msg: "Internal Server Error",
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: GET single order
// METHOD: GET /api/orders/:id
const getOrder = async ({
  params,
  response,
}: {
  params: { id: string };
  response: any;
}) => {
  // Searches for a particular order in the DB
  const order = await orders.findOne({ reference: params.id });
  // If found, respond with the order. If not, respond with a 404
  if (order) {
    response.status = 200;
    response.body = {
      success: true,
      data: order,
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No order found",
    };
  }
};

// DESC: ADD single order
// METHOD: POST /api/orders
const addOrder = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    // If the request has no Body, it will return a 400
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      // Otherwise, it will try to insert
      // a order in the DB and respond with 201
      const body = await request.body();
      const order = await body.value;

      const exists = await orders.findOne({ reference: order.reference });
      if (exists) {
        response.status = 400;
        response.body = {
          success: false,
          msg: "Order with the same reference already exists",
        };
      } else {
        const orderItems: OrderItem[] = order.items;
        let allItemsExist = true;
        for (const item of orderItems) {
          const existItem = await items.findOne({
            reference: item.itemReference,
          });
          if (!existItem) {
            allItemsExist = false;
            break;
          }
        }

        if (allItemsExist) {
          await orders.insertOne(order);
          response.status = 201;
          response.body = {
            success: true,
            data: order,
          };
        } else {
          response.status = 400;
          response.body = {
            success: false,
            msg: "There are items that not exists in BD in your order",
          };
        }
      }
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: UPDATE single order
// METHOD: PUT /api/order/:id
const updateOrder = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    // Search a order in the DB and update with given values if found
    const body = await request.body();
    const inputOrder: Order = await body.value;

    let allItemsExist = true;
    for (const item of inputOrder.items) {
      const existItem = await items.findOne({
        reference: item.itemReference,
      });
      if (!existItem) {
        allItemsExist = false;
        break;
      }
    }
    if (allItemsExist) {
      await orders.updateOne(
        { reference: params.id },
        {
          $set: {
            date: inputOrder.date,
            state: inputOrder.state,
            items: inputOrder.items,
          },
        }
      );
      // Respond with the Updated Order
      const updatedOrder = await orders.findOne({ reference: params.id });
      response.status = 200;
      response.body = {
        success: true,
        data: updatedOrder,
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        msg: "There are items that not exists in BD in your order",
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: DELETE single order
// METHOD: DELETE /api/orders/:id
const deleteOrder = async ({
  params,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
  try {
    // Search for the given order and drop it from the DB
    await orders.deleteOne({ reference: params.id });
    response.status = 201;
    response.body = {
      success: true,
      msg: "Order deleted",
    };
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

export {
  getItems,
  getItem,
  addItem,
  updateItem,
  deleteItem,
  getBoxes,
  getBox,
  addBox,
  updateBox,
  deleteBox,
  getOrders,
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
};
