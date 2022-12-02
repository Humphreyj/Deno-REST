import parseKmz from "npm:parse2-kmz";
import { parseFeatureCollection, addFeatureOrigins } from "../utils/kmz.js";
const getLand = async (ctx) => {
  const body = await ctx.request.body({ type: "form-data" });
  const data = await body.value.read();
  //   let file = await Deno.readFile(data.files[0].filename);
  const kmzData = await parseKmz.toJson(data.files[0].filename);
  //   await Deno.writeFile("hello.kmz", file, { mode: 0o644 });
  let result = parseFeatureCollection(kmzData);
  const parsedLand = addFeatureOrigins(result.projectLand);
  const parsedKeepouts = addFeatureOrigins(result.keepouts, true);
  const parsedData = {
    projectLand: parsedLand,
    keepouts: parsedKeepouts,
    sitePolygon: result.sitePolygon,
  };
  ctx.response.status = 200;
  ctx.response.body = parsedData;
};

export { getLand };
