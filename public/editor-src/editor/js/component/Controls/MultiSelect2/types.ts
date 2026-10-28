import type { ReactElement } from "react";
import type { Literal } from "visual/utils/types/Literal";

export type MultiSelectProps<T extends Literal> = {
  value: T[];
  valueIsLoading?: boolean;
  children: ReactElement<MultiSelectItemProps<T>>[];
  className?: string;
  placeholder?: string;
  search?: boolean;
  searchIsEmpty?: boolean;
  searchIsLoading?: boolean;
  showArrow?: boolean;
  onChange: (value: T[]) => void;
  onSearchChange?: (search: string) => void;
  useAsSimpleSelect?: boolean;
};

export type MultiSelectItemProps<T extends Literal> = {
  title: string;
  value: T;
  disabled?: boolean;
};
