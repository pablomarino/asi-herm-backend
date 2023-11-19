import { orders, items } from "./../database.ts";
import { Order, OrderItem } from "./../models.ts";

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

export { getOrders, getOrder, addOrder, updateOrder, deleteOrder };
