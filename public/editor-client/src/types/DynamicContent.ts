import { Literal } from "../utils/types";
import { Response } from "./Response";

export enum DCTypes {
  image = "image",
  link = "link",
  richText = "richText",
  reference = "reference",
  multiReference = "multiReference"
}

interface BaseDCItem {
  label: string;
  placeholder: string;
  alias?: string;
  display?: "block" | "inline";
  attr?: Record<string, Literal>;
}

export interface ConfigDCItem extends BaseDCItem {
  optgroup?: ConfigDCItem[];
}

export type DCConfigItems = {
  [k in DCTypes]: ConfigDCItem[];
};

export type DCHandler = (
  res: Response<ConfigDCItem[]>,
  rej: Response<string>,
  extraData: { entityType: string; groupType: string }
) => void;
