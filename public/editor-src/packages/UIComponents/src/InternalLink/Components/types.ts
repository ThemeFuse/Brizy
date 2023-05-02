import { CSSProperties, ReactElement } from "react";

export interface SelectDropdownProps {
  style?: CSSProperties;
  isSearchLoading?: boolean;
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
  isLoading?: boolean;
  onChange?: (e: string) => void;
}
