import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";

export interface Value extends ElementModel {
  iconName: string;
  iconType: string;
  iconFilename?: string;
  lineStyle: string;
  style: "text" | "icon" | "default";
  tagName: keyof JSX.IntrinsicElements;
  customCSS: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface StyledLine {
  [key: string]: string;
}

export type HorizontalAlign = "right" | "left" | "center";
export type Size = "small" | "medium" | "large" | "custom";
