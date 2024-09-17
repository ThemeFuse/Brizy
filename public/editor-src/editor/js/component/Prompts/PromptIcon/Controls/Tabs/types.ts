import { TypeId } from "visual/config/icons/Type";

export interface Props {
  currentTypeId: TypeId;
  onClick: (id: TypeId) => VoidFunction;
  onClose: VoidFunction;
}

export interface ItemProps {
  title: string;
  icon: string;
  onClick?: VoidFunction;
  active?: boolean;
}
