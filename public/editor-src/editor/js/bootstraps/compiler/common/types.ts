import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type {
  AdobeFont,
  GoogleFont,
  SystemFont,
  UploadedFont
} from "visual/types/Fonts";
import type { GlobalBlock } from "visual/types/GlobalBlock";
import type { PageCommon } from "visual/types/Page";
import type { Project } from "visual/types/Project";

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
