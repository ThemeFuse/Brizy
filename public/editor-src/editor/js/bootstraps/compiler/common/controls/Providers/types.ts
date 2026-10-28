import type { ReactNode } from "react";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { ComponentTypes } from "visual/providers/EditorComponentProvider/ComponentTypes";
import type { EditorMode } from "visual/providers/EditorModeProvider";
import type { Sheet } from "visual/providers/StyleProvider/Sheet";
import type { Store } from "visual/redux/store";

export interface Props {
  store: Store;
  doc?: Document;
  sheet: Readonly<Sheet>;
  componentTypes: Readonly<ComponentTypes>;
  config: ConfigCommon;
  children: ReactNode;
  editorMode: EditorMode;
}
