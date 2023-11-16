import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./routes.ts";
const PORT = 4000;

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: PORT });
console.log(`Server listening on ${PORT}`);
