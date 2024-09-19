import { Component as ReactComponent } from "react";
import {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import {
  ComponentsMeta,
  ToolbarExtend
} from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";
import { BackgroundValue, FlipboxType, Trigger } from "../types";

export interface Value extends ElementModel {
  value: {
    items: ElementModelType2[];
  };
}

export interface Props extends WithClassName {
  backgroundValue: BackgroundValue;
  meta: ComponentsMeta;
  animationClassName: string;
  flipboxActive: string;
  type: FlipboxType;
  trigger: Trigger;
  updateHeight: VoidFunction;
  extendParentToolbar: (toolbarExtend: ToolbarExtend) => void;
  setNode: (type: FlipboxType, node: HTMLDivElement) => void;
}

export interface Component extends ReactComponent {
  getCurrentCopiedElement: () => Value | null;
  copy: (itemIndex: number) => void;
  paste: (itemIndex: number, cb?: VoidFunction) => void;
  pasteStyles: (itemIndex: number) => void;
  cloneItem: (itemIndex: number, toIndex?: number) => void;
  removeItem: (itemIndex: number) => void;
}
