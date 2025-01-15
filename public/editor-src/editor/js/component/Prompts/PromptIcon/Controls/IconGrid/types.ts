import { Icon } from "visual/config/icons/Icon";
import { IconData } from "../types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Props {
  icons: Icon[];
  value: Partial<IconData>;
  onChange: (icon: IconData) => void;
  config: ConfigCommon;
}
