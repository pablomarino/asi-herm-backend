import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

interface Quote {
    _id: { $oid: string };
    quote: string;
    quoteID: string;
    author: string;
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

const db = client.database("quotesApp"); 
const quotes = db.collection<Quote>("quotes");

// DESC: ADD single quote
// METHOD: POST /api/quote
const addQuote = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  try {
    // If the request has no Body, it will return a 404
    if (!request.hasBody) { 
      response.status = 400;
      response.body = {
        success: false,
        msg: "No Data",
      };
    } else {
      // Otherwise, it will try to insert 
      // a quote in the DB and respond with 201
      const body = await request.body();
      const quote = await body.value;
      await quotes.insertOne(quote);
      response.status = 201;
      response.body = {
        success: true,
        data: quote,
      };
    }
  } catch (err) {
    response.body = {
      success: false,
      msg: err.toString(),
    };
  }
};

// DESC: GET all Quotes
// METHOD GET /api/quote
const getQuotes = async ({ response }: { response: any }) => {
  try {
    // Find all quotes and convert them into an Array
    const allQuotes = await quotes.find({}).toArray();
    console.log(allQuotes);
    if (allQuotes) {
      response.status = 200;
      response.body = {
        success: true,
        data: allQuotes,
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

export { getQuotes, addQuote };


