import { mergeDeep } from "timm";
import { readConfig } from "visual/bootstraps/common/readConfig";
import type { Config } from "visual/global/Config";
import { Page } from "visual/types/Page";
import { getTempConfig } from "../common/utils/getTempConfig";
import { preloadComponents } from "../common/utils/preloadComponents";
import { Static } from "./bootstrap/types";
import { registerThirdParty } from "./thirdParty";
import "./utils/globals";

interface Compiled {
  compiled: Static;
}

const mockPage: Page = {
  id: "mock",
  slug: "mock",
  title: "mock",
  status: "publish",
  data: {
    items: []
  },
  dataVersion: 0,
  dependencies: []
};

async function Core(data: unknown): Promise<Compiled> {
  const _config = readConfig(data);

  // Need to set the thirdPartyComponentsHosts
  // used when @brizy/core tries to obtain the host of every widget
  // @ts-expect-error: Config in worker
  global.__VISUAL_CONFIG__ = getTempConfig(_config);

  try {
    await registerThirdParty(_config);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("IMPORT THIRD PARTY SCRIPT ERROR: ", e);
  }

  // @ts-expect-error Property '__VISUAL_CONFIG__' does not exist on type 'Global & typeof globalThis'. (ts 2339)
  const config: Config = mergeDeep(global.__VISUAL_CONFIG__, _config);

  // Preload elments
  const pageData = config.pageData ?? mockPage;
  preloadComponents({ config, page: pageData });

  const { bootstrap } = await import("./bootstrap");
  const compiled = await bootstrap(config);

  return { compiled };
}

export default Core;
