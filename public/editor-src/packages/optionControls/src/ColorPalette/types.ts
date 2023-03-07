import { Hex } from "../types/Hex";

export type PaletteObject<T> = {
  id: T;
  hex: Hex;
};

export type Props<T> = {
  palette: PaletteObject<T>[];
  value: T;
  openSettings?: VoidFunction;
  className?: string;
  onChange: (v: T) => void;
};
