import { CSSProperties, ReactElement } from "react";
import {
  OnChange as OptionOnChange,
  SimpleValue
} from "visual/component/Options/Type";
import { WithSize } from "visual/types/attributes";
import { Literal } from "visual/utils/types/Literal";
import { ChoicesAsync } from "../types";
import { Attributes } from "visual/utils/string/parseCustomAttributes";

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
