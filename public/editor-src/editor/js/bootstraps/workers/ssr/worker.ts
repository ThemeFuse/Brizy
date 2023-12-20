import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Block, DataCommon as Page, Project } from "visual/types";
import { assetUrl } from "visual/utils/asset";
import { MValue } from "visual/utils/value";
import { Output } from "./components/Editor";

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

//#region Compile Page

interface PageData {
  page: Page;
  project: Project;
  config: ConfigCommon;
}

type CompilePage = (d: PageData) => Promise<MValue<Output>>;

export const compilePage: CompilePage = (data) => {
  return new Promise((res, rej) => {
    const { config, page, project } = data;
    const worker = initWorker(config);

    worker.addEventListener("message", (e) => {
      res(e.data);
      worker.terminate();
    });
    worker.addEventListener("messageerror", rej);

    const msg = JSON.stringify({ page, project, config });
    worker.postMessage(msg);
  });
};

//#endregion

//#region Compile Block

interface BlockData {
  block: Block;
  project: Project;
  config: ConfigCommon;
}

type CompileBlock = (d: BlockData) => Promise<MValue<Output>>;

export const compileBlock: CompileBlock = (data) => {
  return new Promise((res, rej) => {
    const { config, block, project } = data;
    const worker = initWorker(config);
    const page = {
      data: { items: [block] }
    };

    worker.addEventListener("message", (e) => {
      res(e.data);
      worker.terminate();
    });
    worker.addEventListener("messageerror", rej);

    const msg = JSON.stringify({ page, project, config });
    worker.postMessage(msg);
  });
};

//#endregion

export type { Output };
