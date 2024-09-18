import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  AdobeFont,
  GlobalBlock,
  GoogleFont,
  PageCommon,
  Project,
  SystemFont,
  UploadedFont
} from "visual/types";

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

export interface ProjectFontsData {
  upload: UploadedFont[];
  google: GoogleFont[];
  system: SystemFont[];
  adobe: AdobeFont[];
}
