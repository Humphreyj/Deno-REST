import { Router } from "../deps.js";
import { getLand } from "../handlers/files.js";

const land = new Router();

land.post("/upload/land", getLand);

export default land;
