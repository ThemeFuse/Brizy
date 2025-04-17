import { ReactNode } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode } from "visual/providers/EditorModeProvider";

export interface Props {
  config: ConfigCommon;
  editorMode: EditorMode;
  children: ReactNode;
}
