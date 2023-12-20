import Config from "visual/global/Config";

self.onerror = (e) => {
  console.error(e);
};

// @ts-expect-error: Config in worker
global.__VISUAL_CONFIG__ = {};

self.onmessage = async (e: MessageEvent) => {
  const { config, page, project, globalBlocks } = JSON.parse(e.data);
  if (config.thirdPartyAssetsURL) {
    importScripts(config.thirdPartyAssetsURL);
  }

  // @ts-expect-error: Config in worker
  Config.init({ ...global.__VISUAL_CONFIG__, ...config });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Editor } = require("./components/Editor");

  const data = await Editor({ page, project, globalBlocks });

  postMessage(data);
};
