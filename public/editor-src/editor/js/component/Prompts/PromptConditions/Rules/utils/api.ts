import { Dictionary } from "visual/types/utils";

export interface Base {
  value: string;
  title: string;
}

export interface Collection extends Base {
  slug?: string | null;
}

export interface Ref {
  type: "single" | "multi";
  value: string;
  title: string;
  fieldId: string;
}

export type Refs = Dictionary<
  {
    type: "single" | "multi";
    value: string;
    title: string;
    fieldId: string;
  }[]
>;
