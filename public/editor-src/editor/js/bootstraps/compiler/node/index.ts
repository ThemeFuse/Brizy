import Config from "visual/global/Config";
import { Static } from "./bootstrap/types";
import "./utils/globals";
import { readConfig } from "visual/bootstraps/common/readConfig";

interface Compiled {
  compiled: Static;
}

async function Core(_config: unknown): Promise<Compiled> {
  const config = readConfig(_config);
  // @ts-expect-error: Temporary to removed WP | Cloud
  Config.init(config);

  const { bootstrap } = await import("./bootstrap");
  const compiled = await bootstrap(config);

  return { compiled };
}

export default Core;
