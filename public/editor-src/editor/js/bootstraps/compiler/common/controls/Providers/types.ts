import { ReactNode } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ComponentTypes } from "visual/providers/EditorComponentProvider/ComponentTypes";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { Sheet } from "visual/providers/StyleProvider/Sheet";
import { Store } from "visual/redux/store";

export interface Props {
  store: Store;
  doc?: Document;
  sheet: Readonly<Sheet>;
  componentTypes: Readonly<ComponentTypes>;
  config: ConfigCommon;
  children: ReactNode;
  editorMode: EditorMode;
}
