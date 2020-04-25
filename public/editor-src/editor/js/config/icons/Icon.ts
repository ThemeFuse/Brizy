import { Reader } from "visual/utils/types/Type";
import * as Type from "./Type";
import * as Cat from "./Categories";
import * as Str from "visual/utils/string/specs";
import * as Num from "visual/utils/math/number";
import { toArray } from "visual/utils/array";

export type Icon = {
  title: string;
  name: string;
  cat: number[];
  type: Type.Id;
  family?: string;
};

export const read: Reader<Icon> = v => {
  if (v === null || typeof v !== "object") {
    return undefined;
  }

  const title = Str.read((v as Icon).title);
  const name = Str.read((v as Icon).name);
  const type = Type.readId((v as Icon).type);

  if (title === undefined || name === undefined || type === undefined) {
    return undefined;
  }

  const family = Str.read((v as Icon).family);
  const cat = toArray((v as Icon).cat)
    .map(Num.read)
    .filter(Boolean) as Cat.Id[];

  return {
    title,
    name,
    type,
    cat,
    family
  };
};
