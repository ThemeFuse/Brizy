import { Response } from "./configs/common";

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
}

export interface ConfigDCItem extends BaseDCItem {
  optgroup?: ConfigDCItem[];
}

export interface ConfigDCReference {
  title: string;
  slug: string;
  dynamicContent: {
    [DCTypes.image]: ConfigDCItem[];
    [DCTypes.link]: ConfigDCItem[];
    [DCTypes.richText]: ConfigDCItem[];
  };
}

// TODO: not complete. add types to other keys when needed
export interface DynamicContentCommon {
  [DCTypes.image]: ConfigDCItem[];
  [DCTypes.link]: ConfigDCItem[];
  [DCTypes.richText]: ConfigDCItem[];
}

export interface DynamicContentCloud extends DynamicContentCommon {
  [DCTypes.reference]: ConfigDCReference[];
  [DCTypes.multiReference]: ConfigDCReference[];
}

type Cnf = {
  cloud: DynamicContentCloud;
  wp: DynamicContentCommon;
};

export type DynamicContent<T extends "wp" | "cloud"> = Cnf[T];

export interface DynamicContentOption {
  [DCTypes.richText]: {
    useCustomPlaceholder?: boolean;
    handler: (res: Response<BaseDCItem>, rej: Response<string>) => void;
  };
}
