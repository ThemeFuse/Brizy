import { Reader } from "visual/utils/types/Type";
import { mCompose } from "visual/utils/value";
import * as Num from "visual/utils/math/number";

export type Id = 0 | 1 | 2;

export const readId: Reader<Id> = mCompose(
  v => (v >= 0 && v <= 2 ? (v as Id) : undefined),
  Math.round,
  Num.read
);

export type Type = {
  id: Id;
  name: string;
  title: string;
  icon: string;
};

export const types: Type[] = [
  {
    id: 0,
    name: "outline",
    title: "Outline",
    icon: "nc-cube"
  },
  {
    id: 1,
    name: "glyph",
    title: "Glyph",
    icon: "nc-full-cube"
  },
  {
    id: 2,
    name: "fa",
    title: "FA",
    icon: "nc-full-cube"
  }
];
