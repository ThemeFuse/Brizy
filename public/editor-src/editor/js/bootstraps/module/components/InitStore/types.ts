import type { ReactNode } from "react";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { EditorMode } from "visual/providers/EditorModeProvider";

export interface Props {
  config: ConfigCommon;
  editorMode: EditorMode;
  children: ReactNode;
}
