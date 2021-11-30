export interface BaseData {
  title: string;
  required: boolean;
  name: string;
  helper?: null | string;
}

export interface InputData extends BaseData {
  type: undefined;
  value: string;
}

export interface SelectData extends BaseData {
  type: "select";
  value: string;
  choices: {
    title: string;
    name: string;
  }[];
}

export interface SwitchData extends BaseData {
  type: "switch";
  value: boolean;
}

export interface SearchData extends BaseData {
  type: "search";
  value: string;
  multiple: boolean;
  choices: {
    title: string;
    value: string;
  }[];
}

export type AllData = InputData | SelectData | SwitchData | SearchData;

export interface Props {
  id: string;
  headTitle?: string;
  headDescription?: string;
  description?: string;
  data: AllData[];
  nextLoading: null | boolean;
  prevLoading: null | boolean;
  onActive: (n: string, v: string | number | boolean) => void;
  error?: string;
  onPrev?: VoidFunction;
  onNext?: VoidFunction;
}

export const isInput = (o: AllData): o is InputData => {
  return o.type === undefined;
};

export const isSelect = (o: AllData): o is SelectData => {
  return o.type === "select";
};

export const isSwitch = (o: AllData): o is SwitchData => {
  return o.type === "switch";
};

export const isSearch = (o: AllData): o is SearchData => {
  return o.type === "search";
};
