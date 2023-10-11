export type PlaceholderName = "placeholder";

export type PlaceholderEndName = "placeholder";

export const placeholderName: PlaceholderName = "placeholder";

export const placeholderEndName: PlaceholderEndName = "placeholder";

export interface DCPlaceholderEndObj {
  name: PlaceholderEndName;
  content: string;
}

export interface DCPlaceholderStartObj {
  name: PlaceholderName;
  content: string;
  attrStr?: string;
  attr?: {
    entityId?: string;
    entityType?: string;

    // For Image
    cW?: string;
    cH?: string;
    [k: string]: unknown;
  };
}

export type DCPlaceholderObj = DCPlaceholderStartObj | DCPlaceholderEndObj;
