import type { ReactNode } from "react";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Props {
  config: ConfigCommon;
  children: ReactNode;
}
