import { CSSProperties, ReactElement } from "react";
import {
  OnChange as OptionOnChange,
  SimpleValue
} from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";
import { WithSize } from "visual/utils/options/attributes";
import { ChoicesAsync } from "../types";

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

export interface SourceSelectProps {
  choices: ChoicesAsync;
  label?: string;
  value: SimpleValue<Literal>;
  onChange: OptionOnChange<SimpleValue<Literal>>;
  helper?: string;
  config?: WithSize;
}
