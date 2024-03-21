import { expose } from "comlink";
import { mergeDeep } from "timm";
import Config from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Static } from "./bootstrap/types";
import { getProScriptUrl } from "./utils/getProScriptUrl";
import { getThirdPartyScriptUrl } from "./utils/getThirdPartyScriptUrl";
import "./utils/globals";

// @ts-expect-error: Config in worker
global.__VISUAL_CONFIG__ = {};

class Core {
  async compile(data: string): Promise<Static> {
    const {
      page,
      project,
      globalBlocks,
      needToCompile,
      config: _config
    } = JSON.parse(data);

    // Load the pro components
    const proScriptUrl = getProScriptUrl(_config);
    if (proScriptUrl) {
      importScripts(proScriptUrl);
    }

    // Load the third party components
    const thirdPartyScriptUrl = getThirdPartyScriptUrl(_config);
    if (thirdPartyScriptUrl) {
      importScripts(thirdPartyScriptUrl);
    }

    // @ts-expect-error: Config in worker
    const config: ConfigCommon = mergeDeep(global.__VISUAL_CONFIG__, _config);
    // @ts-expect-error: Config in worker
    Config.init(config);

    const { bootstrap } = await import("./bootstrap");

    return await bootstrap({
      config,
      page,
      project,
      needToCompile,
      globalBlocks
    });
  }
}

export type Compiler = typeof Core;

expose(Core);
