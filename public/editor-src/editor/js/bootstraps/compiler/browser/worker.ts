import { wrap } from "comlink";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page } from "visual/types/Page";
import { Project } from "visual/types/Project";
import { assetUrl } from "visual/utils/asset";
import { _Worker } from "visual/utils/worker";
import type { Compiler } from "./";
import { Static } from "./bootstrap/types";

// Note: Workers are build in a separated files
// See webpack.config.worker.js
const getWorkerUrl = (config: ConfigCommon): string => {
  const base = config.urls?.worker ?? assetUrl("editor/js", config);
  const version = config.editorVersion ?? "latest";
  return `${base}/compiler.min.js?ver=${version}`;
};

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
