import { mergeDeep } from "timm";
import { readConfig } from "visual/bootstraps/common/readConfig";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getTempConfig } from "../common/utils/getTempConfig";
import { Static } from "./bootstrap/types";
import { registerThirdParty } from "./thirdParty";
import "./utils/globals";

interface Compiled {
  compiled: Static;
}

async function Core(_config: unknown): Promise<Compiled> {
  const config = readConfig(_config);

  // Need to set the thirdPartyComponentsHosts
  // used when @brizy/core tries to obtain the host of every widget
  // @ts-expect-error: Config in worker
  global.__VISUAL_CONFIG__ = getTempConfig(_config);

  try {
    await registerThirdParty(config);
  } catch (e) {
    console.warn("IMPORT THIRD PARTY SCRIPT ERROR: ", e);
  }

  const { bootstrap } = await import("./bootstrap");
  const compiled = await bootstrap(
    // @ts-expect-error Property '__VISUAL_CONFIG__' does not exist on type 'Global & typeof globalThis'. (ts 2339)
    mergeDeep(global.__VISUAL_CONFIG__, config) as ConfigCommon
  );

  return { compiled };
}

export default Core;
