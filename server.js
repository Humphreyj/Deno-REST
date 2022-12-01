// server.ts
import { Application, Router } from "./deps.js";
import { auth } from "./handlers/auth.js";
import { authorized } from "./middleware/authenticated.js";
import {
  getAllPeople,
  getPerson,
  addPerson,
  deletePerson,
  updatePerson,
} from "./routes.js";
const app = new Application();
const router = new Router();
const port = 3030;

router
  .get("/", (ctx) => {
    ctx.response.body = "Hello from Deno";
  })
  .post("/authenticate", auth)
  .get("/people", getAllPeople)
  .get("/person/:id", authorized, getPerson)
  .patch("/update", updatePerson)
  .delete("/goaway/:id", deletePerson)
  .post("/person", addPerson);

// Here, we are telling our application to use the router
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port });
console.log(`Server is running on port ${port}`);
