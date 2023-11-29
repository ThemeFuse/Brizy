import { Output } from "visual/bootstraps/workers/ssr/components/Editor";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, DataCommon as Page, Project } from "visual/types";
import { assetUrl } from "visual/utils/asset";
import { MValue } from "visual/utils/value";

// Note: Workers are build in a separated files
// See webpack.config.worker.js
const getWorkerUrl = (config: ConfigCommon): string => {
  // @ts-expect-error: Need to remove all others Config like Cloud | WP
  const url = config.urls?.worker ?? assetUrl("editor/js");
  return `${url}/ssr.worker.min.js`;
};

const initWorker = (config: ConfigCommon): Worker => {
  return new Worker(getWorkerUrl(config));
};

interface Data {
  page: Page;
  globalBlocks: Record<string, GlobalBlock>;
  project: Project;
  config: ConfigCommon;
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

    const msg = JSON.stringify({ page, globalBlocks, project, config });
    worker.postMessage(msg);
  });
};
