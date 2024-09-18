import { ExtraFontStyle, FontStyle } from "visual/types";
import { getFontStyle } from "visual/utils/fonts";
import { Literal, read } from "visual/utils/types/Literal";
import { Obj } from "@brizy/readers";
import { mPipe } from "fp-utilities";

interface Data {
  key: string;
  value: Literal;
  style?: string;
  styles?: {
    fontStyles: Array<FontStyle>;
    extraFontStyles: Array<ExtraFontStyle>;
  };
}

export function getOptionFontByGlobal(data: Data): Literal {
  const { key, value, style, styles } = data;

  if (style) {
    const fontStyle = getFontStyle(style, styles);
    const getKey = mPipe(Obj.read, Obj.readKey(key), read);
    const value = getKey(fontStyle);

    if (value) {
      return value;
    }
  }

  return value;
}
