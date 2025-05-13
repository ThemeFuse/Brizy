import type { ElementModel } from "visual/component/Elements/Types";

export enum ProgressStyle {
  Style1 = "style1",
  Style2 = "style2"
}

export interface Value extends ElementModel {
  className: string;
  percentage: number;
  showPercentage: "on" | "off";
  showText: "on" | "off";
  progressBarStyle: ProgressStyle;
  customCSS: string;
}

export type Animate = (data: {
  text: HTMLSpanElement | null;
  wrapper: HTMLDivElement;
  value: number;
  type: ProgressStyle;
}) => void;
