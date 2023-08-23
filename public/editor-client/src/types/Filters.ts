import { NewType } from "./NewType";
import { Response } from "./Response";

export type Choice = { title: string; value: string | number };

export type QueryTypeSource = NewType<string, "tripleString">;

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

export interface Filters {
  handler: (
    res: Response<Choice[]>,
    rej: Response<string>,
    args: {
      postId: string;
      loopAttributes: string;
    }
  ) => void;
  possibleValues: (
    res: Response<Choice[]>,
    rej: Response<string>,
    data: {
      postId: string;
      loopAttributes: string;
      optionSource: string;
      type: string;
      search?: string;
    }
  ) => void;
}
