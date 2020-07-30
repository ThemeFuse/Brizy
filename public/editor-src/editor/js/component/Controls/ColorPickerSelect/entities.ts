import { Literal } from "visual/utils/types/Literal";

export type Meta = {
  isChanged: "hex" | "palette" | "opacity" | "select";
  opacityDragEnd?: boolean;
};

export type Value<T extends Literal> = {
  select: T;
  opacity: number;
  hex: string;
  palette: string;
};
