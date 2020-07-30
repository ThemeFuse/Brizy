import { ElementModel } from "visual/component/Elements/Types";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";

export type CSSValue = {
  v: ElementModel;
  device: ResponsiveMode;
  state: State;
  prefix?: string;
};
