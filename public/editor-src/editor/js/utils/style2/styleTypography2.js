import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getFontById } from "visual/utils/fonts";
import { getOptionFontByGlobal } from "visual/utils/options";

export function styleTypography2FontFamily({ v, device, state }) {
  const fontFamily = getOptionFontByGlobal(
    "fontFamily",
    v.fontFamily,
    defaultValueValue({ v, key: "fontStyle", device, state })
  );

  const fontFamilyType = getOptionFontByGlobal(
    "fontFamilyType",
    v.fontFamilyType,
    defaultValueValue({ v, key: "fontStyle", device, state })
  );

  return getFontById({ type: fontFamilyType, family: fontFamily }).family;
}

export function styleTypography2FontSize({ v, device, state }) {
  const fontSize = getOptionFontByGlobal(
    defaultValueKey({ key: "fontSize", device, state }),
    defaultValueValue({ v, key: "fontSize", device, state }),
    defaultValueValue({ v, key: "fontStyle", device, state })
  );

  return fontSize;
}

export function styleTypography2LineHeight({ v, device, state }) {
  const lineHeight = getOptionFontByGlobal(
    defaultValueKey({ key: "lineHeight", device, state }),
    defaultValueValue({ v, key: "lineHeight", device, state }),
    defaultValueValue({ v, key: "fontStyle", device, state })
  );

  return lineHeight;
}

export function styleTypography2FontWeight({ v, device, state }) {
  const fontWeight = getOptionFontByGlobal(
    defaultValueKey({ key: "fontWeight", device, state }),
    defaultValueValue({ v, key: "fontWeight", device, state }),
    defaultValueValue({ v, key: "fontStyle", device, state })
  );

  return fontWeight;
}

export function styleTypography2LetterSpacing({ v, device, state }) {
  const letterSpacing = getOptionFontByGlobal(
    defaultValueKey({ key: "letterSpacing", device, state }),
    defaultValueValue({ v, key: "letterSpacing", device, state }),
    defaultValueValue({ v, key: "fontStyle", device, state })
  );

  return letterSpacing;
}
