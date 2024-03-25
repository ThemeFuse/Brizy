import { Component as ReactComponent } from "react";
import {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import {
  ComponentsMeta,
  ToolbarExtend
} from "visual/editorComponents/EditorComponent/types";
import {
  BackgroundValue,
  FlipboxType
} from "visual/editorComponents/Flipbox/types";
import { WithClassName } from "visual/utils/options/attributes";

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
  extendParentToolbar: (toolbarExtend: ToolbarExtend) => void;
  type: FlipboxType;
  setNode: (type: FlipboxType, node: HTMLDivElement) => void;
  updateHeight: VoidFunction;
}

export interface Component extends ReactComponent {
  getCurrentCopiedElement: () => Value | null;
  copy: (itemIndex: number) => void;
  paste: (itemIndex: number, cb?: VoidFunction) => void;
  pasteStyles: (itemIndex: number) => void;
  cloneItem: (itemIndex: number, toIndex?: number) => void;
  removeItem: (itemIndex: number) => void;
}
