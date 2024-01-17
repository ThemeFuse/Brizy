import { ReactElement } from "react";
import { FormField } from "../../type";

export type HelperFn = (f: FormField[]) => ReactElement;

export interface BaseData {
  title: string;
  name: string;
  required?: boolean;
  helper?: null | string | HelperFn;
}

export interface InputData extends BaseData {
  type: "input";
  value: string | null;
}

export interface SelectData extends BaseData {
  type: "legacy-select";
  value: string | null;
  choices: {
    title: string;
    name: string;
  }[];
}

export interface SwitchData extends BaseData {
  type: "switch";
  value: boolean | null;
}

export interface SearchData extends BaseData {
  type: "search";
  value: string | null;
  multiple: boolean;
  choices: {
    title: string;
    value: string;
  }[];
}

export type AllData = InputData | SelectData | SwitchData | SearchData;

export interface Props {
  formId: string;
  formFields: FormField[];
  id: string;
  headTitle?: string;
  headDescription?: string;
  descriptions?: string;
  data: AllData[];
  nextLoading: null | boolean;
  prevLoading: null | boolean;
  onActive: (n: string, v: string | number | boolean) => void;
  error?: string;
  onPrev?: VoidFunction;
  onNext?: VoidFunction;
}

export const isInput = (o: AllData): o is InputData => {
  return o.type === undefined || o.type === "input";
};

export const isSelect = (o: AllData): o is SelectData => {
  return o.type === "legacy-select";
};

export const isSwitch = (o: AllData): o is SwitchData => {
  return o.type === "switch";
};

export const isSearch = (o: AllData): o is SearchData => {
  return o.type === "search";
};
