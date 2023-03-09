import { CSSProperties, ReactElement } from "react";

export interface SelectDropdownProps {
  style?: CSSProperties;
  searchIsLoading?: boolean;
  children: ReactElement;
  onSearchChange?: (s: string) => void;
}

export interface SelectItemProps {
  title: string;
  onClick?: () => void;
}

export interface InternalLinkValueProps {
  className?: string;
  value?: string;
  onClick?: VoidFunction;
  onRemove?: VoidFunction;
}

export interface SearchProps {
  loading?: boolean;
  onChange?: (e: string) => void;
}
