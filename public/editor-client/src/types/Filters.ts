import { pass } from "fp-utilities";
import { Literal } from "../utils/types";
import { NewType } from "./NewType";
import { Response } from "./Response";

export type Choice = { title: string; value: Literal };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isChoice = (values: any): values is Choice => {
  return typeof values === "object" && "title" in values && "value" in values;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isChoiceArray = (arr: any): arr is Choice[] => {
  if (!Array.isArray(arr)) return false;
  for (const item of arr) {
    if (!isChoice(item)) return false;
  }
  return true;
};

export type QueryTypeSource = NewType<string, "tripleString">;

export const isQueryTypeSource = (s: string): s is QueryTypeSource =>
  s.split("|||").length === 3;

export const fromStringQueryTypeSource = pass(isQueryTypeSource);

interface FieldsCommon {
  filterQuery: string;
  label: string;
  optionQuery: string;
  optionSource: string;
  filterBy: string;
  type: string;
}

export interface FilterField extends FieldsCommon {
  possibleValues: PossibleValue[] | Choice[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPossibleValue = (values: any): values is PossibleValue => {
  return (
    typeof values === "object" &&
    "count" in values &&
    "description" in values &&
    "filter" in values &&
    "name" in values &&
    "parent" in values &&
    "slug" in values &&
    "taxonomy" in values &&
    "term_group" in values &&
    "term_id" in values &&
    "term_taxonomy_id" in values
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPossibleValueArray = (arr: any): arr is PossibleValue[] => {
  if (!Array.isArray(arr)) return false;
  for (const item of arr) {
    if (!isPossibleValue(item)) return false;
  }
  return true;
};

export type PossibleValue = {
  count: number;
  description: string;
  filter: string;
  name: string;
  parent: number;
  slug: string;
  taxonomy: string;
  term_group: number;
  term_id: number;
  term_taxonomy_id: number;
};

export type FilterFieldsData = {
  fields: FilterField[];
  taxonomies: FilterField[];
  metaFields: FilterField[];
  authors: FilterField[];
};

export interface FiltersHandlerArgs {
  postId: string;
  loopAttributes: string;
}

export interface FiltersValuesArgs {
  postId: string;
  loopAttributes: string;
  optionSource: string;
  type: string;
  search?: string;
}

export interface Filters {
  handler: (
    res: Response<Choice[]>,
    rej: Response<string>,
    args: FiltersHandlerArgs
  ) => void;
  possibleValues: (
    res: Response<Choice[]>,
    rej: Response<string>,
    data: FiltersValuesArgs
  ) => void;
}
