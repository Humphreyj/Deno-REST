// server.ts
import { Application } from "./deps.js";
import router from "./routes.js";
import land from "./routes/landRoutes.js";
const app = new Application();

const port = 3030;

// Here, we are telling our application to use the router
app.use(router.routes());
app.use(land.routes());
app.use(router.allowedMethods());
app.listen({ port });
console.log(`Server is running on port ${port}`);
