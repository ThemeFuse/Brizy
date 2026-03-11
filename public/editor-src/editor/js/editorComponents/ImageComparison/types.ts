import { EditorMode } from "visual/providers/EditorModeProvider";
import { RenderType } from "visual/providers/RenderProvider";
import { Store } from "visual/redux/store";
import { WithClassName } from "visual/types/attributes";
import { Meta, V, WrapperSizes } from "../Image/types";

export interface Props extends WithClassName {
  meta: Meta;
}

export type ImageContent = {
  v: V;
  vs: V;
  vd: V;
  _id: string;
  componentId: string;
  meta: Meta;
  wrapperSizes: WrapperSizes;
  renderContext: RenderType;
  editorMode: EditorMode;
  extraAttributes?: React.HTMLAttributes<HTMLImageElement>;
  onStart?: VoidFunction;
  onEnd?: VoidFunction;
  onChange?: (patch: { sliderPosition: number }) => void;
  store: Store;
};
