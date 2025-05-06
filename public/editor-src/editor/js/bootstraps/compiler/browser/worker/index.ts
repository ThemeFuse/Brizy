import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { Page } from "visual/types/Page";
import type { Project } from "visual/types/Project";
import { assetUrl } from "visual/utils/asset";
import type { Static } from "../bootstrap/types";
import { WorkerPool } from "./WorkerPool";

// Note: Workers are build in a separated files
// See webpack.config.worker.js
const getWorkerUrl = (config: ConfigCommon): string => {
  const base = config.urls?.worker ?? assetUrl("editor/js", config);
  const version = config.editorVersion ?? "latest";
  return `${base}/compiler.min.js?ver=${version}`;
};

//#region Compile Page

interface Compile {
  config: ConfigCommon;
  project: Project;
  page: Page;
}

// Set up 2 concurency Workers, adjust the number of workers as needed
const CONCURENCY_WORKERS = 2;

export async function compilePage(data: Compile): Promise<Static> {
  const { config } = data;
  const workerPool = await WorkerPool.getInstance({
    workerUrl: getWorkerUrl(config),
    workers: CONCURENCY_WORKERS
  });

  return await workerPool.process(data);
}

//#endregion
