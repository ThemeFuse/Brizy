import type { CSSProperties, ReactElement } from "react";
import type {
  OnChange as OptionOnChange,
  SimpleValue
} from "visual/component/Options/Type";
import type { WithSize } from "visual/types/attributes";
import type { Attributes } from "visual/utils/string/parseCustomAttributes";
import type { Literal } from "visual/utils/types/Literal";
import type { ChoicesAsync } from "../types";

export interface SelectDropdownProps {
  style?: CSSProperties;
  searchIsLoading?: boolean;
  children: ReactElement;
  onSearchChange?: (s: string) => void;
  maxHeight?: number;
  attr?: Attributes;
}

export interface SelectItemProps {
  title: string;
  onClick?: () => void;
  className?: string;
}

export type StatusRule = "published" | "draft";

export interface InternalLinkValueProps {
  className?: string;
  value?: string;
  onClick?: VoidFunction;
  onRemove?: VoidFunction;
  arrow?: boolean;
  itemStatus?: StatusRule;
}

export interface SearchProps {
  loading?: boolean;
  onChange?: (e: string) => void;
}

export interface SourceSelectProps {
  choices: ChoicesAsync;
  label?: string;
  value: SimpleValue<Literal>;
  onChange: OptionOnChange<SimpleValue<Literal>>;
  helper?: string;
  config?: WithSize;
}
