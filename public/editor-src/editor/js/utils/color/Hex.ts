import { NewType } from "visual/types/NewType";
import { mPipe, pass } from "visual/utils/fp";

const hexRegex = /^#(?:[A-Fa-f0-9]{3}){1,2}$/; // taken from http://stackoverflow.com/questions/32673760/how-can-i-know-if-a-given-string-is-hex-rgb-rgba-or-hsl-color-using-javascipt#answer-32685393

enum hex {
  hex = "hex"
}

export type Hex = "#000000" | "#ffffff" | NewType<string, hex.hex>;

export const is = (v: string): v is Hex => hexRegex.test(v);

export const fromString = mPipe(pass(is));

export const Black: Hex = "#000000";

export const White: Hex = "#ffffff";

export const unsafe = (v: string): Hex => v as Hex;

export const fromRgb = (rgb: [number, number, number]): Hex => {
  return ("#" +
    ("0" + rgb[0].toString(16)).slice(-2) +
    ("0" + rgb[1].toString(16)).slice(-2) +
    ("0" + rgb[2].toString(16)).slice(-2)) as Hex;
};
