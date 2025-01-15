import { CustomIcon } from "visual/config/icons/Icon";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Props {
  icons: CustomIcon[];
  name?: string;
  onChange: (v: CustomIcon) => void;
  canUpload?: boolean;
  onRemove?: (id: number) => void;
  config: ConfigCommon;
}
