import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode } from "visual/providers/EditorModeProvider";

export interface Props {
  configId: string;
  config: ConfigCommon;
  editorMode: EditorMode;
}
