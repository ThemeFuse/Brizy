import { PaletteType } from "visual/types/Style";
import { Hex } from "visual/utils/color/Hex";
import { match } from "visual/utils/fp/match";
import { NoEmptyBlur } from "./NoEmptyBlur";
import { NoEmptyOpacity } from "./NoEmptyOpacity";

// region Empty
export interface Empty {
  hex: Hex;
  opacity: 0;
  blur: 0;
  palette: undefined;
  vertical: 0;
  horizontal: 0;
  tempOpacity: NoEmptyOpacity;
  tempPalette: PaletteType | undefined;
  tempBlur: NoEmptyBlur;
  tempVertical: number;
  tempHorizontal: number;
}

export const isEmpty = (v: Value): v is Empty => v.opacity === 0;

export const fromNoEmpty = (v: NoEmpty): Empty => ({
  opacity: 0,
  blur: 0,
  vertical: 0,
  horizontal: 0,
  hex: v.hex,
  palette: undefined,
  tempVertical: v.vertical,
  tempHorizontal: v.horizontal,
  tempBlur: v.blur,
  tempOpacity: v.opacity,
  tempPalette: v.palette
});
// endregion

// region NoEmpty
export interface NoEmpty {
  hex: Hex;
  opacity: NoEmptyOpacity;
  palette: PaletteType | undefined;
  blur: NoEmptyBlur;
  vertical: number;
  horizontal: number;
}

export const isNoEmpty = (v: Value): v is NoEmpty => v.opacity !== 0;

export const fromEmpty = (v: Empty): NoEmpty => ({
  opacity: v.tempOpacity,
  blur: v.tempBlur,
  horizontal: v.tempHorizontal,
  vertical: v.tempVertical,
  hex: v.hex,
  palette: v.tempPalette
});
// endregion

const isZero = (n: number): n is 0 => n === 0;
const isNoEmptyOpacity = (v: 0 | NoEmptyOpacity): v is NoEmptyOpacity =>
  v !== 0;
const isNoEmptyBlur = (v: 0 | NoEmptyBlur): v is NoEmptyBlur => v !== 0;

// region Value
export type Value = Empty | NoEmpty;

export const setHex = (hex: Hex, value: Value): Value => {
  return match(
    [
      isEmpty,
      (v): NoEmpty => ({
        palette: undefined,
        horizontal: v.tempHorizontal,
        vertical: v.tempVertical,
        blur: v.tempBlur,
        opacity: v.tempOpacity,
        hex
      })
    ],
    [isNoEmpty, (v): NoEmpty => ({ ...v, hex, palette: undefined })]
  )(value);
};

export const setPalette = (palette: PaletteType, value: Value): Value => {
  return match(
    [
      isEmpty,
      (v): NoEmpty => ({
        palette,
        horizontal: v.tempHorizontal,
        vertical: v.tempVertical,
        blur: v.tempBlur,
        opacity: v.tempOpacity,
        hex: v.hex
      })
    ],
    [isNoEmpty, (v): NoEmpty => ({ ...v, palette })]
  )(value);
};

export const setOpacity = (
  opacity: 0 | NoEmptyOpacity,
  value: Value
): Value => {
  return match(
    [
      isEmpty,
      (v): Value =>
        // if new opacity is empty, we need to return an Empty value
        match(
          [isZero, (): Empty => v],
          [
            isNoEmptyOpacity,
            (opacity): NoEmpty => ({ ...fromEmpty(v), opacity })
          ]
        )(opacity)
    ],
    [
      isNoEmpty,
      (v): Value =>
        // if new opacity is not empty, we need to return an NoEmpty value
        match(
          [isZero, (): Empty => fromNoEmpty(v)],
          [isNoEmptyOpacity, (opacity): NoEmpty => ({ ...v, opacity })]
        )(opacity)
    ]
  )(value);
};

export const setBlur = (blur: 0 | NoEmptyBlur, value: Value): Value => {
  return match(
    [
      isEmpty,
      (v): Value =>
        // if new opacity is empty, we need to return an Empty value
        match(
          [isZero, (): Empty => v],
          [isNoEmptyBlur, (blur): NoEmpty => ({ ...fromEmpty(v), blur })]
        )(blur)
    ],
    [
      isNoEmpty,
      (v): Value =>
        // if new opacity is not empty, we need to return an NoEmpty value
        match(
          [isZero, (): Empty => fromNoEmpty(v)],
          [isNoEmptyBlur, (blur): NoEmpty => ({ ...v, blur })]
        )(blur)
    ]
  )(value);
};

export const setHorizontal = (horizontal: number, value: Value): Value => {
  return match(
    [
      isEmpty,
      (v): Value => (horizontal == 0 ? v : { ...fromEmpty(v), horizontal })
    ],
    [isNoEmpty, (v): Value => ({ ...v, horizontal })]
  )(value);
};

export const setVertical = (vertical: number, value: Value): Value => {
  return match(
    [
      isEmpty,
      (v): Value => (vertical == 0 ? v : { ...fromEmpty(v), vertical })
    ],
    [isNoEmpty, (v): Value => ({ ...v, vertical })]
  )(value);
};
// endregion
