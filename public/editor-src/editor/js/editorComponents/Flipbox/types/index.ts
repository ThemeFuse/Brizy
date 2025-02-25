import { ReactNode } from "react";
import type { ElementModel } from "visual/component/Elements/Types";
import type { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { DeviceMode } from "visual/types";
import type { WithClassName } from "visual/types/attributes";
import { MValue } from "visual/utils/value";

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
  tabletBg: string;
  mobileBg: string;
  bgImageSrc: string;
  tabletBgImageSrc: string;
  mobileBgImageSrc: string;
  bgImageExtension: string;
  tabletBgImageExtension: string;
  mobileBgImageExtension: string;
  bgPopulation: string;
  tabletBgPopulation: string;
  mobileBgPopulation: string;
  bgImageFileName: string;
  tabletBgImageFileName: string;
  mobileBgImageFileName: string;
  bgSizeType: string;
  tabletBgSizeType: string;
  mobileBgSizeType: string;
  bgImageWidth: number;
  tabletBgImageWidth: number;
  mobileBgImageWidth: number;
  bgImageHeight: number;
  tabletBgImageHeight: number;
  mobileBgImageHeight: number;
  bgPositionX: number;
  tabletBgPositionX: number;
  mobileBgPositionX: number;
  bgPositionY: number;
  tabletBgPositionY: number;
  mobileBgPositionY: number;
  bgColorType: string;
  tabletBgColorType: string;
  mobileBgColorType: string;
  bgColorOpacity: number;
  tabletBgColorOpacity: number;
  mobileBgColorOpacity: number;
  bgColorHex: string;
  tabletBgColorHex: string;
  mobileBgColorHex: string;
  bgColorPalette: string;
  tabletBgColorPalette: string;
  mobileBgColorPalette: string;
  gradientColorHex: string;
  tabletGradientColorHex: string;
  mobileGradientColorHex: string;
  gradientColorOpacity: number;
  tabletGradientColorOpacity: number;
  mobileGradientColorOpacity: number;
  gradientColorPalette: string;
  tabletGradientColorPalette: string;
  mobileGradientColorPalette: string;
  gradientType: string;
  tabletGradientType: string;
  mobileGradientType: string;
}

export type GetBackgroundValue = (data: {
  type: FlipboxType;
  v: Value;
  device: DeviceMode;
}) => MValue<BackgroundValue>;

export type BackgroundValueGetter = (data: {
  type: FlipboxType;
  v: Value;
}) => (device: DeviceMode) => MValue<BackgroundValue>;
