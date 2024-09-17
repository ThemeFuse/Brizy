import { ElementModel } from "visual/component/Elements/Types";
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
};

export interface GradientCssDeclaration {
  colorType?: string;
  gradientType?: string;
  gradientLinearDegree?: number;
  gradientRadialDegree?: number;
  gradientStartPointer?: number;
  gradientFinishPointer?: number;
  gradientColor?: string;
  bgColor?: string;
}
