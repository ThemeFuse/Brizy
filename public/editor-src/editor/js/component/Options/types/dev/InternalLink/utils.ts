import { partial, property } from "underscore";
import * as A from "visual/utils/array";
import { toObject } from "visual/utils/object";
import { String } from "visual/utils/string/specs";
import { Reader } from "visual/utils/types/Type";
import { mCompose } from "visual/utils/value";
import { Choice } from "../Select/types";
import { ChoiceWithPermalink, ChoicesSync } from "./types";

const readPost: Reader<ChoiceWithPermalink> = (v) => {
  type _Post = {
    value: string;
    title: string;
  };

  if (typeof v !== "object") {
    return undefined;
  }

  const value = String.read((v as _Post).value);
  const title = String.read((v as _Post).title);

  return value && title ? { title, value } : undefined;
};

export const toPosts = mCompose(
  partial(A.read, readPost),
  property("posts"),
  toObject
);

export const normalizeItem = (item: ChoiceWithPermalink): Choice => ({
  title: item.title,
  value: item.permalink ?? ""
});

export const normalizeItems = (items: ChoicesSync): Choice[] => {
  if (items.length === 1 && items[0].value === "" && items[0].title === "") {
    return [];
  }

  return items.map(normalizeItem);
};
