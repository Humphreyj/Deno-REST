import parseKmz from "npm:parse2-kmz";

const getLand = async (ctx) => {
  const body = await ctx.request.body({ type: "form-data" });
  const data = await body.value.read();
  let file = await Deno.readFile(data.files[0].filename);
  const kmzData = await parseKmz.toJson(data.files[0].filename);
  console.log(kmzData);
  //   await Deno.writeFile("hello.kmz", file, { mode: 0o644 });

  ctx.response.status = 200;
  ctx.response.body = kmzData;
};

export { getLand };
