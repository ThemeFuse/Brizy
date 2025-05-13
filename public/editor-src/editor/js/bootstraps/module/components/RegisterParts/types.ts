import { ReactNode } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Props {
  config: ConfigCommon;
  children: ReactNode;
}
