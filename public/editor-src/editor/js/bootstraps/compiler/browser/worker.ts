import { wrap } from "comlink";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, Page, Project } from "visual/types";
import { assetUrl } from "visual/utils/asset";
import type { Compiler } from "./";
import { Static } from "./bootstrap/types";
import { MValue } from "visual/utils/value";

// Note: Workers are build in a separated files
// See webpack.config.worker.js
const getWorkerUrl = (config: ConfigCommon): string => {
  //@ts-expect-error: Temporary need to move the urls types to ConfigCommon
  const base = config.urls?.worker ?? assetUrl("editor/js");
  const version = config.editorVersion ?? "latest";
  return `${base}/compiler.min.js?ver=${version}`;
};

// Some third-party embed codes may override the default `window.Worker`.
// This code stores the original `Worker` for later use.
const _Worker = (function () {
  let instance: MValue<typeof Worker> = globalThis.Worker;

  function createInstance() {
    return globalThis.Worker;
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
    reset() {
      instance = undefined;
    }
  };
})();

const initWorker = (config: ConfigCommon): Worker => {
  const Worker = _Worker.getInstance();
  return new Worker(getWorkerUrl(config));
};

//#region Compile Page

interface Compile {
  config: ConfigCommon;
  needToCompile: {
    page?: Page;
    project?: Project;
    globalBlocks?: Array<GlobalBlock>;
  };
  page: Page;
  project: Project;
  globalBlocks?: Array<GlobalBlock>;
}

export async function compilePage(data: Compile): Promise<Static> {
  const { config } = data;
  const worker = initWorker(config);
  const Compiler = wrap<Compiler>(worker);
  const compiler = await new Compiler();
  return await compiler.compile(JSON.stringify(data));
}

//#endregion
