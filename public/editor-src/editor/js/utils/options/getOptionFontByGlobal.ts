import { Obj } from "@brizy/readers";
import { mPipe } from "fp-utilities";
import { Store } from "visual/redux/store";
import { getFontStyle } from "visual/utils/fonts/getFontStyle";
import { Literal, read } from "visual/utils/types/Literal";

interface Data {
  key: string;
  value: Literal;
  style?: string;
  store: Store;
}

export function getOptionFontByGlobal(data: Data): Literal {
  const { key, value, style, store } = data;

  if (style) {
    const fontStyle = getFontStyle({ id: style, store });
    const getKey = mPipe(Obj.read, Obj.readKey(key), read);
    const value = getKey(fontStyle);

    if (value) {
      return value;
    }
  }

  return value;
}
