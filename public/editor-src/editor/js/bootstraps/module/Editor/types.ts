import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { EditorMode } from "visual/providers/EditorModeProvider";
import type { Dictionary } from "visual/utils/i18n/I18n";

export interface Props {
  config: ConfigCommon;
  editorMode: EditorMode;
  i18n?: Dictionary;
}
