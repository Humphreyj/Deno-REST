import { getToken } from "../utils/jwt.js";
import { verify } from "../deps.js";
import { generateKey } from "../handlers/auth.js";
export const authorized = async (ctx, next) => {
  try {
    const jwt = getToken(ctx.request.headers);
    if (!jwt) {
      throw new Error("!jwt");
    }
    const secret = Deno.env.get("API_SECRET");
    const key = await generateKey(secret);
    const payload = await verify(jwt, key);
    if (!payload) {
      ctx.throw(401, "Unauthorized");
    }

    await next();
  } catch (err) {
    console.error(err);
    ctx.throw(401, "Unauthorized");
  }
};
