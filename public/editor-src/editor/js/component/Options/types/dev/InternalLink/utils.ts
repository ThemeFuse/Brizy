import { partial, property } from "underscore";
import * as A from "visual/utils/array";
import { toObject } from "visual/utils/object";
import { String } from "visual/utils/string/specs";
import { Reader } from "visual/utils/types/Type";
import { mCompose } from "visual/utils/value";
import { Choice } from "../Select/types";
import { Post } from "./types/Post";

const readPost: Reader<Post> = (v) => {
  type _Post = {
    ID: number;
    title: string;
  };

  if (typeof v !== "object") {
    return undefined;
  }

  const id = String.read((v as _Post).ID);
  const title = String.read((v as _Post).title);

  return id && title ? { id, title } : undefined;
};

export const toPosts = mCompose(
  partial(A.read, readPost),
  property("posts"),
  toObject
);

const normalizeItem = (item: Post): Choice => {
  return { title: item.title, value: item.id };
};

export const normalizeItems = (items: Post[]): Choice[] => {
  if (items.length === 1 && items[0].id === "" && items[0].title === "") {
    return [];
  }

  return items.map(normalizeItem);
};
