import { ElementModel } from "visual/component/Elements/Types";
import { GetConfig } from "visual/providers/ConfigProvider/types";
import { Store } from "visual/redux/store";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";

export type CSSValue<
  T extends ElementModel = ElementModel,
  P extends Record<string, unknown> = Record<string, unknown>
> = {
  v: T;
  device: ResponsiveMode;
  state: State;
  prefix?: string;
  mode?: string;
  props?: P;
  store: Store;
  getConfig: GetConfig;
};

export interface GradientStop {
  color: string;
  position: number;
}

export interface GradientCssDeclaration {
  colorType?: string;
  gradientType?: string;
  gradientLinearDegree?: number;
  gradientRadialDegree?: number;
  gradientStartPointer?: number;
  gradientFinishPointer?: number;
  gradientColor?: string;
  bgColor?: string;
  gradientSpeed?: number;
  gradientStops?: GradientStop[];
}
