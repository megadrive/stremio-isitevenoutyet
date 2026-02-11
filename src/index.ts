import { getRouter } from "@stremio-addon/node-express";
import { addonInterface } from "./addon.js";
import express from "express";
import { appEnv } from "./env.js";

const app = express();

app.use("/", getRouter(addonInterface));
app.get("/", (_, res) => res.redirect("/manifest.json"));

app.listen(appEnv.PORT, () => {
  console.log(`Addon listening at http://localhost:${appEnv.PORT}`);
});
