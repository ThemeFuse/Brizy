import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, PageCommon, Project } from "visual/types";

//#region GetCompileHTML

export interface Data {
  config: ConfigCommon;
  project: Project;
  page: PageCommon;
  globalBlocks?: Array<GlobalBlock>;
  needToCompile: {
    project?: Project;
    page?: PageCommon;
    globalBlocks?: Array<GlobalBlock>;
  };
}

//#endregion
