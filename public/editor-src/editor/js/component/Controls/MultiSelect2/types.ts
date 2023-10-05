import { ReactElement } from "react";

export type MultiSelectProps<T> = {
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

export type MultiSelectItemProps<T> = {
  title: string;
  value: T;
  disabled?: boolean;
};
