import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ReduxState } from "visual/redux/types";
import { ExtraFontStyle, Style } from "visual/types/Style";

export interface StateProps {
  styles: Style[];
  currentStyle: ReduxState["currentStyle"];
  extraFontStyles: ExtraFontStyle[];
  extraStyles: Style[];
}

export interface OwnProps {
  config: ConfigCommon;
}

export interface State {
  loadingColor: boolean;
  loadingTypography: boolean;
}

export type Action = {
  type: string;
  payload: string;
};
