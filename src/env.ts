import "dotenv/config";
import { cleanEnv, num } from "envalid";

export const appEnv = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
});
