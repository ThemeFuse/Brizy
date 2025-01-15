import { TypeId } from "visual/config/icons/Type";
import { Literal } from "visual/utils/types/Literal";
import { Icon } from "visual/config/icons/Icon";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export interface Category {
  id: Literal;
  title: string;
  name?: string;
}

export interface IconData extends Pick<Icon, "name"> {
  type: string;
}

export interface Props {
  name?: string;
  type?: string;
  typeId: TypeId;
  opened: boolean;
  search: string;
  categories: Category[];
  categoryId: Literal;
  onTabClick: (id: TypeId) => void;
  onIconClick: (v: IconData) => void;
  onSelectChange: (id: Literal) => void;
  onInputChange: (value: string) => void;
  onClose?: VoidFunction;
  config: ConfigCommon;
}
