import { expose } from "comlink";
import { mergeDeep } from "timm";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getTempConfig } from "../common/utils/getTempConfig";
import { Static } from "./bootstrap/types";
import { getProScriptUrl } from "./utils/getProScriptUrl";
import { getThirdPartyScriptUrl } from "./utils/getThirdPartyScriptUrl";
import "./utils/globals";

// @ts-expect-error: Config in worker
global.__VISUAL_CONFIG__ = {};

class Core {
  async compile(data: string): Promise<Static> {
    const { project, config: _config, page } = JSON.parse(data);

    // Load the pro components
    const proScriptUrl = getProScriptUrl(_config);
    if (proScriptUrl) {
      importScripts(proScriptUrl);
    }

    // Need to set the thirdPartyComponentsHosts
    // used when @brizy/core tries to obtain the host of every widget
    // @ts-expect-error: Config in worker
    global.__VISUAL_CONFIG__ = getTempConfig(_config);

    // Load the third party components
    const thirdPartyScriptsUrl = getThirdPartyScriptUrl(_config);
    try {
      importScripts(...thirdPartyScriptsUrl);
    } catch (e) {
      console.warn("IMPORT THIRD PARTY SCRIPT ERROR: ", e);
    }

    // @ts-expect-error: Config in worker
    const config: ConfigCommon = mergeDeep(global.__VISUAL_CONFIG__, _config);

    const { bootstrap } = await import("./bootstrap");

    return await bootstrap({
      config,
      project,
      editorMode: config.mode,
      page
    });
  }
}

export type Compiler = typeof Core;
export type { Core };

expose(Core);
