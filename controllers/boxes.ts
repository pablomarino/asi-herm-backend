import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { boxes, items } from "./../database.ts";
import { Box } from "./../models.ts";

// DESC: GET all Boxes | filter by referenceItem
// METHOD GET /api/boxes | GET /api/boxes?referenceItem="{{referenceItem}}"
const getBoxes = async (ctx: Context) => {
  try {
    const itemReference = ctx.request.url.searchParams.get("itemReference");

    let query = {};
    if (itemReference) {
      // Si itemReference está presente, lo usamos para filtrar
      query = { itemReference };
    }

    // Encuentra las cajas basadas en el query
    const allBoxes = await boxes.find(query).toArray();
    if (allBoxes) {
      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        data: allBoxes,
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        success: false,
        msg: "Internal Server Error",
      };
    }
  } catch (err) {
    ctx.response.body = {
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
            numItems: inputBox.numItems
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

export { getBoxes, getBox, addBox, updateBox, deleteBox };
