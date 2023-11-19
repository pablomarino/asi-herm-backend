import { items, boxes } from "./../database.ts";
import { Item } from "../models.ts";

async function addNumItemsToItems(items: Item[]): Promise<Item[]> {
  async function getNumItems(item: Item) {
    const boxesFromItem = await boxes
      .find({ itemReference: item.reference })
      .toArray();
    const totalNumItems = boxesFromItem.reduce((total, box) => {
      return total + (box.numItems || 0);
    }, 0);
    return totalNumItems;
  }

  const itemsWithCount = await Promise.all(
    items.map(async (item) => {
      const numTotalItems = await getNumItems(item);
      return {
        ...item,
        numTotalItems,
      };
    })
  );

  return itemsWithCount;
}

// DESC: GET all Items
// METHOD GET /api/items
const getItems = async ({ response }: { response: any }) => {
  try {
    // Find all items and convert them into an Array
    const allItems = await items.find({}).toArray();
    if (allItems) {
      response.status = 200;
      response.body = {
        success: true,
        data: await addNumItemsToItems(allItems),
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
      data: (await addNumItemsToItems([item]))[0],
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

export { getItems, getItem, addItem, updateItem, deleteItem };
