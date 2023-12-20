import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, PageCommon, Project } from "visual/types";
import { MValue } from "visual/utils/value";

//#region GetCompileHTML

export interface Data {
  project: Project;
  page: PageCommon;
  globalBlocks?: Array<GlobalBlock>;
  config: ConfigCommon;
}

interface Output {
  html: string;
  styles: Array<string>;
  scripts: Array<string>;
}

export interface GlobalBlockOutput extends Output {
  id: string;
}

export interface Compile {
  page: MValue<Output>;
  globalBlocks?: Array<GlobalBlockOutput>;
}

export type GetCompileHTML = (d: Data) => Promise<Compile>;

//#endregion
