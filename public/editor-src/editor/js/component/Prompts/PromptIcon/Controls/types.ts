import { TypeId } from "visual/config/icons/Type";
import { Literal } from "visual/utils/types/Literal";
import { Icon } from "visual/config/icons/Icon";

export interface Category {
  id: Literal;
  name: string;
  title: string;
}

export interface IconData extends Pick<Icon, "name"> {
  type: string;
}

export interface Props {
  name: string;
  type: string;
  typeId: TypeId;
  opened: boolean;
  search: string;
  categories: Category[];
  categoryId: Literal;
  onTabClick: (id: TypeId) => VoidFunction;
  onIconClick: (v: IconData) => VoidFunction;
  onSelectChange: (id: Literal) => VoidFunction;
  onInputChange: (value: string) => void;
  onClose: VoidFunction;
}
