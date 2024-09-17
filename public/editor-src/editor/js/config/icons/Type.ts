import { Num } from "@brizy/readers";
import { Reader } from "visual/utils/types/Type";
import { mCompose } from "visual/utils/value";

export const readId: Reader<TypeId> = mCompose(
  (v) => (v >= 0 && v <= 3 ? (v as TypeId) : undefined),
  Math.round,
  Num.read
);

export type Type = {
  id: TypeId;
  name: string;
  title: string;
  icon: string;
  proDescription?: boolean;
};

export enum IconTypes {
  Outline = "outline",
  Glyph = "glyph",
  Fa = "fa",
  Custom = "custom"
}

export enum TypeId {
  Outline = 0,
  Glyph = 1,
  Fa = 2,
  Custom = 3
}

export const types: Type[] = [
  {
    id: TypeId.Outline,
    name: "outline",
    title: "Outline",
    icon: "nc-cube"
  },
  {
    id: TypeId.Glyph,
    name: "glyph",
    title: "Glyph",
    icon: "nc-full-cube"
  },
  {
    id: TypeId.Fa,
    name: "fa",
    title: "FA",
    icon: "nc-full-cube"
  },
  { id: TypeId.Custom, name: "custom", title: "Custom", icon: "nc-star" }
];
