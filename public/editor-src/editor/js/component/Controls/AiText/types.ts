import { ReactElement } from "react";

export interface DropdownOption {
  label: string;
  action: string;
}

export interface Action extends DropdownOption {
  icon: ReactElement;
}

export interface DropdownButtonData {
  data: DropdownOption[];
  icon: ReactElement;
  label: string;
  width: string;
}

export enum action {
  Extend = "extend",
  Shorten = "shorten",
  Simplify = "simplify"
}
