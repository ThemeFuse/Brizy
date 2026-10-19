import type { Icon } from "visual/config/icons/Icon";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { IconData } from "../types";

export interface Props {
  icons: Icon[];
  value: Partial<IconData>;
  onChange: (icon: IconData) => void;
  config: ConfigCommon;
}
