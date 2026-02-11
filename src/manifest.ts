import { type ManifestSchema } from "@stremio-addon/zod";

export const manifest: ManifestSchema = {
  id: "com.almosteffective.isitevenoutyet",
  version: "1.0.0",
  name: "Is it even out yet?",
  description:
    "Shows a stream entry if the film or episode isn't out yet. Saves you time wondering why you can't watch something!",
  resources: ["stream"],
  types: ["movie", "series"],
  catalogs: [],
};
