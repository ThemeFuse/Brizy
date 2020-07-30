import { Type } from "visual/component/Options/types/dev/BoxShadow/entities/type";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";

export type Value = {
  type: Type;
  hex: string;
  opacity: number;
  palette: Palette.Palette;
  blur: number;
  spread: number;
  vertical: number;
  horizontal: number;
};

export type Meta = {
  isChanged: keyof Value;
};

export type TypeObject = {
  id: Type;
  title: string;
};
