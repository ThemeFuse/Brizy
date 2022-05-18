import { Hex } from "visual/utils/color/Hex";

export type Value<P, O> = {
  hex: Hex;
  opacity: number;
  palette?: P;
  blur: number;
  vertical: number;
  horizontal: number;
  select: O;
};

export type Meta<P, O> = {
  isChanged: keyof Value<P, O>;
};
