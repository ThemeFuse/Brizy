import { property, partial } from "underscore";
import { Post } from "./types/Post";
import * as A from "visual/utils/array";
import { mCompose } from "visual/utils/value";
import { Reader } from "visual/utils/types/Type";
import { NumberSpec } from "visual/utils/math/number";
import { String } from "visual/utils/string/specs";
import { toObject } from "visual/utils/object";
import { ElementValue } from "visual/component/Options/types/dev/InternalLink/types/ElementValue";

const readPost: Reader<Post> = v => {
  type _Post = {
    ID: number;
    title: string;
  };

  if (typeof v !== "object") {
    return undefined;
  }

  const id = NumberSpec.read((v as _Post).ID);
  const title = String.read((v as _Post).title);

  return id && title ? { id, title } : undefined;
};

export const trimTitle = (s: string): string =>
  s.length > 24 ? s.slice(0, 23) + "..." : s;

export const toPosts = mCompose(
  partial(A.read, readPost),
  property("posts"),
  toObject
);

export const toElementValue = (p: Post): ElementValue => ({
  value: p.id,
  title: p.title
});
