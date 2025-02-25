import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";

export type MarkerType = "numbers" | "circle";

export interface Value extends ElementModel {
  // is string because in model is saved as stringified array
  selectedElements: string;
  markerType: MarkerType;
  textUnderline: "on" | "off";
  include: string;
  exclude: string;
  navIcon: string;
  animDuration: number;
  customCSS: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface State {
  isOpened: boolean;
  headings: HTMLElement[];
}

export type Patch = Partial<Value>;
