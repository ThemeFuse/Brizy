import { readConfig } from "visual/bootstraps/common/readConfig";
import { Static } from "./bootstrap/types";
import "./utils/globals";

interface Compiled {
  compiled: Static;
}

async function Core(_config: unknown): Promise<Compiled> {
  const config = readConfig(_config);
  const { bootstrap } = await import("./bootstrap");
  const compiled = await bootstrap(config);

  return { compiled };
}

export default Core;
