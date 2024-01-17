import { expose } from "comlink";
import Config from "visual/global/Config";
import { Static } from "./components/types";

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

    if (_config.thirdPartyAssetsURL) {
      importScripts(_config.thirdPartyAssetsURL);
    }

    // @ts-expect-error: Config in worker
    const config = { ...global.__VISUAL_CONFIG__, ..._config };
    Config.init(config);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Editor } = require("./components/Editor");

    return await Editor({ config, page, project, needToCompile, globalBlocks });
  }
}

export type Compiler = typeof Core;

expose(Core);
