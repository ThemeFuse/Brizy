import { ReactNode } from "react";
import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import type { WithClassName } from "visual/types/attributes";


export type Patch = Partial<Value>;

export interface Meta {
  [k: string]: unknown;

  patch: Patch;
}

export type FlipboxType = "front" | "back";

export type Transition =
  | "flip"
  | "slide"
  | "push"
  | "zoomIn"
  | "zoomOut"
  | "fade";

export type Direction = "left" | "right" | "up" | "down";

export enum Trigger {
  Click = "click",
  Hover = "hover"
}

export interface Value extends ElementModel {
  flipboxActive: FlipboxType;
  transition: Transition;
  direction: Direction;
  trigger: Trigger;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface State {
  isTransitioned: boolean;
  itTurns: boolean;
  height: number;
}

export interface ContentProps {
  type: FlipboxType;
  isActive: boolean;
  animationClassName: string;
  children: ReactNode;
}

export interface BackgroundValue {
  bg: string;
  bgImageSrc: string;
  bgImageExtension: string;
  bgPopulation: string;
  bgImageFileName: string;
  bgSizeType: string;
  bgImageWidth: number;
  bgImageHeight: number;
  bgPositionX: number;
  bgPositionY: number;
  bgColorType: string;
  bgColorOpacity: number;
  bgColorHex: string;
  bgColorPalette: string;
  gradientColorHex: string;
  gradientColorOpacity: number;
  gradientColorPalette: string;
  gradientType: string;
}
