import { ElementModelType2 } from "visual/component/Elements/Types";

export type Active = Record<string, boolean> | boolean | number;

export interface RadioProps {
  options: string[];
  label: string;
  labelType: string;
  showPlaceholder: boolean;
  attr: {
    placeholder: string;
    type: string;
    value: string;
    defaultValue?: string;
  };
}

export interface SelectAttributes extends Record<string, boolean> {
  multiple: boolean;
}

export interface SelectState {
  isOpen: boolean;
}

export interface SelectProps {
  options: string[];
  label: string;
  labelType: string;
  showPlaceholder: boolean;
  attr: {
    placeholder: string;
    type: string;
    value: string;
    defaultValue?: string;
    multiple?: boolean;
  };
  items: ElementModelType2[];
}

export interface CheckboxProps {
  children: React.JSX.Element | React.JSX.Element[];
  active: Record<string, boolean>;
  defaultValue?: string;
  items?: ElementModelType2[];
  onChange?: (value: Record<string, unknown>) => void;
}

export interface UserAgreementCheckboxProps {
  active: Record<string, boolean>;
  onChange?: (value: Record<string, unknown>) => void;
  label?: string;
  userAgreementLabel: string;
  enableCustomHtml?: string;
  customHtml?: string;
}
