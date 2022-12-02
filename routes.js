import { Router } from "./deps.js";
import {
  getAllPeople,
  getPerson,
  addPerson,
  deletePerson,
  updatePerson,
} from "./handlers/people.js";
import { auth } from "./handlers/auth.js";
import { authorized } from "./middleware/authenticated.js";

const router = new Router();

router
  .post("/authenticate", auth)
  .get("/people", getAllPeople)
  .get("/person/:id", authorized, getPerson)
  .patch("/update", updatePerson)
  .delete("/goaway/:id", deletePerson)
  .post("/person", authorized, addPerson);

export default router;
