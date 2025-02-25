import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ThirdPartyComponents } from "visual/global/Config/types/configs/ThirdParty";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { PageCommon } from "visual/types/Page";
import { Project } from "visual/types/Project";

type Config = Omit<ConfigCommon, "pageData" | "projectData" | "mode">;

export interface Props {
  config: Config;
  mode: EditorMode | "popup" | "story"; // popup and story are used in brizy-local
  pageData: PageCommon;
  projectData: Project | Project["data"];
  thirdPartyComponents?: ThirdPartyComponents;
}
