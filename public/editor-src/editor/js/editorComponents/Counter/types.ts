import type { ElementModel } from "visual/component/Elements/Types";

export enum StyleType {
  Simple = "simple",
  Radial = "radial",
  Empty = "empty",
  Pie = "pie"
}

export interface Value extends ElementModel {
  type: StyleType;
  start: number;
  end: number;
  duration: number;
  strokeWidth: number;
  separator: string;
  prefixLabel: string;
  prefixLabelRadial: string;
  suffixLabel: string;
  suffixLabelRadial: string;
  width: number;
  tabletWidth: number;
  mobileWidth: number;
  widthSuffix: string;
  tabletWidthSuffix: string;
  mobileWidthSuffix: string;
  customCSS: string;
}

export interface State {
  final: number;
}

export interface TransformValue
  extends Omit<
    Value,
    | "width"
    | "widthSuffix"
    | "tabletWidth"
    | "tabletWidthSuffix"
    | "mobileWidth"
    | "mobileWidthSuffix"
  > {
  size: number;
  tabletSize: number;
  mobileSize: number;
  sizeSuffix: string;
  tabletSizeSuffix: string;
  mobileSizeSuffix: string;
}

export interface CounterData {
  elem: HTMLElement;
  start: number;
  end: number;
  duration: number;
  separator: string;
  wasAnimated?: boolean;
}
