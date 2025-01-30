import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  AdobeFont,
  GoogleFont,
  SystemFont,
  UploadedFont
} from "visual/types/Fonts";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { PageCommon } from "visual/types/Page";
import { Project } from "visual/types/Project";

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
