import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ThirdPartyComponents } from "visual/global/Config/types/configs/ThirdParty";
import type { EditorMode } from "visual/providers/EditorModeProvider";
import type { PageCommon } from "visual/types/Page";
import type { Project } from "visual/types/Project";

type Config = Omit<ConfigCommon, "pageData" | "projectData" | "mode">;

export interface Props {
  mode: EditorMode | "popup" | "story"; // popup and story are used in brizy-local
  pageData: PageCommon;
  projectData: Project | Project["data"];
  config?: Config;
  thirdPartyComponents?: ThirdPartyComponents;
}
