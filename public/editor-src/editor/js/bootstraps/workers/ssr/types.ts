import { Config } from "visual/global/Config";
import { GlobalBlock, PageCommon, Project } from "visual/types";

export interface Data {
  data: {
    config: Config;
    page: PageCommon;
    project: Project;
    globalBlocks: Record<string, GlobalBlock>;
  };
}
