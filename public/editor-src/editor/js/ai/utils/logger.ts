import createDebug from "debug";

const BASE = "brizy:editor:ai";

export const log = {
  setup: createDebug(`${BASE}:setup`),
  tools: createDebug(`${BASE}:tools`),
  ui: createDebug(`${BASE}:ui`),
  repository: createDebug(`${BASE}:repository`)
};
