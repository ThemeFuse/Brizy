import type { Icon } from "visual/config/icons/Icon";
import type { TypeId } from "visual/config/icons/Type";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import type { Literal } from "visual/utils/types/Literal";

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
  onClose: VoidFunction;
  config: ConfigCommon;
}
