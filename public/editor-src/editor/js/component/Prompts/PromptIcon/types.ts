import { TypeId } from "visual/config/icons/Type";
import { Literal } from "visual/utils/types/Literal";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Icon {
  name: string;
  type: string;
}

export interface Props {
  name?: string;
  type?: string;
  filename?: string;
  opened?: boolean;
  onClose?: VoidFunction;
  onChange: (i: Icon) => void;
  config: ConfigCommon;
}

export interface State {
  typeId: TypeId;
  categoryId: Literal;
  search: string;
}
