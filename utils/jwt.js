import { decode } from "../deps.js";

export const getToken = (headers) => {
  const authorization = headers.get("Authorization");
  if (!authorization) {
    return null;
  }
  const [method, token] = authorization.split(" ");
  if (method !== "Bearer") {
    return null;
  }

  if (!token) {
    return null;
  }

  return token;
};

export function getPayloadFromToken(headers) {
  try {
    const token = getToken(headers);
    if (!token) {
      return null;
    }

    const { payload } = decode(token);
    if (!payload) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
