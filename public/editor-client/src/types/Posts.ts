import { hasKey, isObject } from "../utils/reader/object";
import { is as isString } from "../utils/reader/string";
import { Response } from "./Response";

export type OrderBy = {
  id: string;
  title: string;
};

export const isOrderBy = (item: unknown): item is OrderBy =>
  isObject(item) &&
  hasKey("id", item) &&
  hasKey("title", item) &&
  isString(item.id) &&
  isString(item.title);

type PostSources = {
  sources: { id: string; title: string; orderBy: OrderBy[] }[];
};

export interface Posts {
  handler: (res: Response<PostSources>, rej: Response<string>) => void;
}
