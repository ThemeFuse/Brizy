import type { TypeId } from "visual/config/icons/Type";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { Literal } from "visual/utils/types/Literal";

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
