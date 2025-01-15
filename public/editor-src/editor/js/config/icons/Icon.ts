import { Num, Obj, Str, pipe } from "@brizy/readers";
import { mPipe, optional, parseStrict } from "fp-utilities";
import { toArray } from "visual/utils/array";
import { always } from "visual/utils/fp";
import { Reader } from "visual/utils/types/Type";
import { throwOnNullish } from "visual/utils/value";
import * as Cat from "./Categories";
import * as Type from "./Type";
import { IconTypes } from "./Type";

export type Icon = {
  title: string;
  name: string;
  cat: number[];
  type: Type.TypeId;
  family?: string;
};

export interface CustomIcon {
  name: string;
  filename?: string;
  type: IconTypes;
}

export const read: Reader<Icon> = (v) => {
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

export const readCustom = parseStrict<Record<string, unknown>, CustomIcon>({
  name: pipe(
    mPipe(Obj.readKey("name"), Str.read),
    throwOnNullish("Invalid Icon name")
  ),
  filename: optional(mPipe(Obj.readKey("filename"), Str.read)),
  type: always(IconTypes.Custom)
});
