import { create, getNumericDate } from "../deps.js";

export const auth = async (ctx) => {
  if (!ctx.request.hasBody) {
    ctx.responseBody.body = "Missing required Info";
    ctx.response.status = 400;
  }
  const body = ctx.request.body();
  const { username, password } = await body.value;

  if (!username || !password) {
    ctx.throw(400, "Required info is missing");
  }

  const responseBody = {
    access_token: await getToken(getPayload(username)),
  };

  ctx.response.body = responseBody;
  ctx.response.status = 200;
};

const getToken = async (payload) => {
  const secret = Deno.env.get("API_SECRET");

  const key = await generateKey(secret);
  console.log(key);

  const jwt = await create({ alg: "HS512", typ: "JWT" }, payload, key);
  return jwt;
};

const getPayload = (username) => {
  return {
    username,
    exp: getNumericDate(60 * 60),
  };
};

const encoder = new TextEncoder();
export const generateKey = async (secretKey) => {
  const keyBuf = encoder.encode(secretKey);
  return await crypto.subtle.importKey(
    "raw",
    keyBuf,
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"]
  );
};
