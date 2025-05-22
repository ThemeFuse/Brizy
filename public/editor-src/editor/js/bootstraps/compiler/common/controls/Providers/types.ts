import { ReactNode } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { Sheet } from "visual/providers/StyleProvider/Sheet";
import { Store } from "visual/redux/store";

export interface Props {
  store: Store;
  doc?: Document;
  sheet: Readonly<Sheet>;
  config: ConfigCommon;
  children: ReactNode;
  editorMode: EditorMode;
}
