import { GetItemPropsOptions } from "downshift";
import {
  DetailedHTMLProps,
  HTMLProps,
  LegacyRef,
  LiHTMLAttributes,
  MouseEventHandler
} from "react";

export interface InputProps {
  isMultiple?: boolean;
  selectedItem: string[] | string;
  isOpen: boolean;
  toggleMenu: () => void;
  inputProps: HTMLProps<HTMLInputElement>;
}

interface GetItemPropsOptionsDownshift {
  "aria-selected": boolean;
  id: string;
  onClick: MouseEventHandler<HTMLLIElement>;
  onMouseDown: MouseEventHandler<HTMLLIElement>;
  onMouseMove: MouseEventHandler<HTMLLIElement>;
  role: string;
}

interface GetMenuProps {
  "aria-labelledby": string;
  id: string;
  ref: LegacyRef<HTMLUListElement> | undefined;
  role: string;
}

export interface DropdownProps extends Props, State {
  getItemProps: (
    options: GetItemPropsOptions<
      DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
    >
  ) => GetItemPropsOptionsDownshift;
  getMenuProps: () => GetMenuProps;
  highlightedIndex: null | number;
  isOpen: boolean;
  selectedItem: string;
}

export interface MultipleValue {
  title: string;
  value: string;
}

export interface SingleValue {
  label: string;
  value: string;
}

export interface Props {
  className?: string;
  value?: string[] | string | undefined | null;
  options: MultipleValue[] | SingleValue[];
  placement?: "bottom";
  placeholder?: string;
  isFixed?: boolean;
  minItems?: number;
  maxItems?: number;
  itemHeight?: number;
  isMultiple?: boolean;
  onChange: (value: string[] | SingleValue) => void;
}

export interface State {
  inputValue: string;
}
