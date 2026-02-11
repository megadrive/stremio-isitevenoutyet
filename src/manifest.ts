import { type ManifestSchema } from "@stremio-addon/zod";

export const manifest: ManifestSchema = {
  id: "com.almosteffective.isitevenoutyet",
  version: "1.0.1",
  name: "Is it even out yet?",
  icon: "https://fav.farm/%F0%9F%A4%B7%E2%80%8D%E2%99%80%EF%B8%8F",
  description:
    "Shows a stream entry if the film or episode isn't out yet. Saves you time wondering why you can't watch something!",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
};
