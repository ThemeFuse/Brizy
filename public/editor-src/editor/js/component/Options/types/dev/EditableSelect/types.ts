import {
  Props as OptionProps,
  SimpleValue
} from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";

export type ElementModelValue = SimpleValue<Literal>;

export interface Choice {
  icon?: {
    name?: string;
    className?: string;
  };
  title: string;
  value: string;
  allowRemove?: boolean;
  allowEdit?: boolean;
  allowDuplicate?: boolean;
}

export enum OnChangeActionTypes {
  remove = "remove",
  duplicate = "duplicate",
  edit = "edit",
  change = "change"
}

export interface OnChangeAction {
  type: OnChangeActionTypes;
  payload: string;
}

export interface Props extends OptionProps<ElementModelValue, OnChangeAction> {
  choices: Choice[];
  placeholder?: string;
  className?: string;
  iconClassName?: string;
  onChange: (action: OnChangeAction) => void;
}

export enum OnChangeCases {
  Symbol,
  Edit,
  Duplicate,
  Delete
}

export interface ActionTypes {
  type: OnChangeCases;
  payload: string;
}

interface SymbolChange {
  type: OnChangeCases.Symbol;
  payload: string;
}

interface Edit {
  type: OnChangeCases.Edit;
  payload: string;
}

interface Duplicate {
  type: OnChangeCases.Duplicate;
}

interface Delete {
  type: OnChangeCases.Delete;
}

export type Actions = SymbolChange | Edit | Duplicate | Delete;
