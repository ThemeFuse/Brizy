import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Dictionary } from "visual/utils/i18n/I18n";
import { EditorMode } from "visual/global/EditorModeContext";

export interface Props {
  config: ConfigCommon;
  editorMode: EditorMode;
  i18n?: Dictionary;
}
