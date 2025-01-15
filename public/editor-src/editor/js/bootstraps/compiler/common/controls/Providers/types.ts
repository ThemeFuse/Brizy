import { ReactNode } from "react";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Sheet } from "visual/providers/StyleProvider/Sheet";
import { Store } from "visual/redux/store";

export interface Props {
  store: Store;
  sheet: Sheet;
  config: ConfigCommon;
  children: ReactNode;
}
