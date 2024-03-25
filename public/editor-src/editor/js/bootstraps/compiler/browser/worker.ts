import { wrap } from "comlink";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, PageCommon, Project } from "visual/types";
import { assetUrl } from "visual/utils/asset";
import type { Compiler } from "./";
import { Static } from "./bootstrap/types";

// Note: Workers are build in a separated files
// See webpack.config.worker.js
const getWorkerUrl = (config: ConfigCommon): string => {
  //@ts-expect-error: Temporary need to move the urls types to ConfigCommon
  const base = config.urls?.worker ?? assetUrl("editor/js");
  const version = config.editorVersion;
  return `${base}/compiler.min.js?ver=${version}`;
};

const initWorker = (config: ConfigCommon): Worker => {
  return new Worker(getWorkerUrl(config));
};

//#region Compile Page

interface Compile {
  config: ConfigCommon;
  needToCompile: {
    page?: PageCommon;
    project?: Project;
    globalBlocks?: Array<GlobalBlock>;
  };
  page: PageCommon;
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
