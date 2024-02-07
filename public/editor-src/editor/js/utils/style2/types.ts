import { ElementModel } from "visual/component/Elements/Types";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";

export type CSSValue<T extends ElementModel = ElementModel> = {
  v: T;
  device: ResponsiveMode;
  state: State;
  prefix?: string;
  mode?: string;
};

export interface GradientCssDeclaration {
  colorType?: string;
  gradientType?: string;
  gradientLinearDegree?: string;
  gradientRadialDegree?: string;
  gradientStartPointer?: string;
  gradientFinishPointer?: string;
  gradientColor?: string;
  bgColor?: string;
}
