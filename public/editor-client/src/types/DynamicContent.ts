import { MValue } from "../utils/types";

export type Dictionary<T> = {
  [k: string]: T | undefined;
};

export interface DCPlaceholderObj {
  name: string;
  attr?: Dictionary<unknown>;
}

export type MakePlaceholder = (
  placeholderObj: DCPlaceholderObj
) => MValue<string>;

export type ExplodePlaceholder = (
  placeholder: string
) => MValue<DCPlaceholderObj>;
