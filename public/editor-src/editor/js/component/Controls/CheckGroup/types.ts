import { ReactNode } from "react";
import { SimpleValue } from "visual/component/Options/Type";

interface Common {
  value: string;
}

type Active = {
  active: boolean;
};

interface CheckGroupCommon extends Common {
  children: ReactNode;
  className?: string;
  name?: string;
  onClick?: VoidFunction;
}

export interface Props {
  children: JSX.Element | JSX.Element[];
  className?: string;
  onChange?: (v: SimpleValue<boolean>) => void;
  defaultValue?: Record<string, unknown>;
}

export interface OptionProps extends Common {
  onClick: VoidFunction;
}

export interface CheckGroupItem extends CheckGroupCommon {
  isEditor: boolean;
  active?: boolean;
  divider?: boolean;
  inline?: boolean;
  required?: boolean;
  label?: string;
  type?: string;
  renderIcons?:
    | ((active: Record<string, boolean>) => JSX.Element)
    | ((v: Active) => JSX.Element);
}

export interface CheckGroupEdit extends CheckGroupCommon {
  active: boolean;
  renderIcons?: (v: Active) => JSX.Element;
}

export interface CheckGroupView
  extends Record<string, unknown>,
    CheckGroupCommon,
    Active {
  required?: boolean;
  attributes: Record<string, unknown>;
}

export interface Change {
  key: string;
  value: boolean;
}

export interface CheckGroupLabelProps {
  label: JSX.Element;
  helperContent: string;
}
