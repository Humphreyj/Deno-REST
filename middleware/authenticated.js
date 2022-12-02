import { getToken } from "../utils/jwt.js";
import { verify } from "../deps.js";
import { generateKey } from "../handlers/auth.js";
export const authorized = async (ctx, next) => {
  try {
    const jwt = getToken(ctx.request.headers);
    if (!jwt) {
      ctx.response.status = 400;
      ctx.response.body = "Mising Something...";
    }
    const secret = Deno.env.get("API_SECRET");

    try {
      const key = await generateKey(secret);
      await verify(jwt, key);
      await next();
    } catch (error) {
      ctx.response.status = 401;
      ctx.response.body = "Unauthorized";
    }
  } catch (err) {
    ctx.response.status = 401;
    ctx.response.body = "Unauthorized";
  }
};
