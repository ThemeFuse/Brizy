import { OptionValue } from "visual/component/Options/types";
import { Weight } from "visual/utils/fonts/Weight";

export type TypographyValues = Omit<
  OptionValue<"typography">,
  | "letterSpacing"
  | "variableFontWeight"
  | "fontWidth"
  | "fontSoftness"
  | "bold"
  | "strike"
  | "italic"
  | "underline"
  | "uppercase"
  | "lowercase"
  | "fontWeight"
  | "script"
> & {
  letterSpacing: string;
  fontWeight: Weight | string;
  variableFontWeight: string;
  textDecoration: string;
  textTransform: string;
  textStyle: string;
};

export interface TextTransformValues {
  textStyle: string;
  textDecoration: string;
  textTransform: string;
}

export type TypographyCssValue = OptionValue<"typography"> &
  Partial<TextTransformValues>;
