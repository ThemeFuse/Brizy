import { ReactNode } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Props {
  id: string;
  config: ConfigCommon;
  children: ReactNode;
}
