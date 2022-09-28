import Config from "visual/global/Config";
import { Data } from "./types";

self.onerror = (e) => {
  console.error(e);
};

self.onmessage = async (e: Data) => {
  const { config, page, project, globalBlocks } = e.data;

  Config.init(config);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Editor } = require("./components/Editor");

  const data = await Editor({
    page: page,
    project,
    globalBlocks
  });

  postMessage(data, config.urls.site);
};
