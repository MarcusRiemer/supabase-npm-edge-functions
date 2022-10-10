import { createRequire } from "https://deno.land/std@0.112.0/node/module.ts";

const require = createRequire(import.meta.url);
export const core_data = require("./npm-lib");

console.log("Hello from core data", core_data);
