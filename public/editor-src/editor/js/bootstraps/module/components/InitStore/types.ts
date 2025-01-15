import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { RenderType } from "visual/providers/RenderProvider";

export interface Props {
  configId: string;
  config: ConfigCommon;
  renderType: RenderType;
}
