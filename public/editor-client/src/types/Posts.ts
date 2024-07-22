import { Obj, Str } from "@brizy/readers";
import { Response } from "./Response";

export type OrderBy = {
  id: string;
  title: string;
};

export const isOrderBy = (item: unknown): item is OrderBy =>
  Obj.isObject(item) &&
  Obj.hasKeys(["id", "title"], item) &&
  Str.is(item.id) &&
  Str.is(item.title);

type PostSources = {
  sources: { id: string; title: string; orderBy: OrderBy[] }[];
};

export interface Posts {
  handler: (res: Response<PostSources>, rej: Response<string>) => void;
}
