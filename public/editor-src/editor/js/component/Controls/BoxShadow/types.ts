import { Type } from "visual/utils/options/BoxShadow/entities/Type";
import * as Palette from "visual/utils/options/ColorPicker/entities/palette";

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
  isChanging?: boolean;
};

export type TypeObject = {
  id: Type;
  title: string;
};
