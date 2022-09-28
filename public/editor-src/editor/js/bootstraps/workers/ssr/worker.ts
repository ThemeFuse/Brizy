import { Config } from "visual/global/Config";
import { DataCommon as Page, GlobalBlock, Project } from "visual/types";
import { assetUrl } from "visual/utils/asset";
import { MValue } from "visual/utils/value";
import { Output } from "./components/Editor";

// Note: Workers are build in a separated files
// See webpack.config.worker.js
const getWorkerUrl = (config: Config): string => {
  const url = config.urls.worker ?? assetUrl("editor/js");
  return `${url}/ssr.worker.js`;
};

const initWorker = (config: Config): Worker => {
  return new Worker(getWorkerUrl(config), { type: "module" });
};

interface Data {
  page: Page;
  globalBlocks: Record<string, GlobalBlock>;
  project: Project;
  config: Config;
}

type Compile = (d: Data) => Promise<MValue<Output>>;

export const compile: Compile = (data) => {
  return new Promise((res, rej) => {
    const { config, page, globalBlocks, project } = data;
    const worker = initWorker(config);

    worker.addEventListener("message", (e) => {
      res(e.data);
      worker.terminate();
    });
    worker.addEventListener("messageerror", rej);

    worker.postMessage({
      page,
      globalBlocks,
      project,
      config
    });
  });
};
