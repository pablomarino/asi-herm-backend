import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

import router from "./routes.ts";
const PORT = 4000;

const app = new Application();
app.use(
  oakCors({
    origin: "*",
  })
);
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: PORT });
console.log(`Server listening on ${PORT}`);
