import { TypeId } from "visual/config/icons/Type";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Props {
  currentTypeId: TypeId;
  onClick: (id: TypeId) => void;
  onClose?: VoidFunction;
  config: ConfigCommon;
}

export interface ItemProps {
  title: string;
  icon: string;
  onClick?: VoidFunction;
  active?: boolean;
}
