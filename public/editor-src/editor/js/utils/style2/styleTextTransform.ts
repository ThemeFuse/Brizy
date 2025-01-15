import { getFontCssStyle } from "visual/utils/fonts";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";
import { capByPrefix } from "visual/utils/string";
import { CSSValue } from "visual/utils/style2/types";

export function styleTextTransformBold({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, device, state, key });
  const boldKey = capByPrefix(prefix, "bold");

  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "bold",
    device
  });
  const value = dvv(boldKey);

  return (
    globalSize ??
    getOptionFontByGlobal({ key: boldKey, value, style: fontStyle, store })
  );
}

export function styleTextTransformItalic({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, device, state, key });
  const italicKey = capByPrefix(prefix, "italic");

  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "italic",
    device
  });
  const value = dvv(italicKey);

  return (
    globalSize ??
    getOptionFontByGlobal({ key: italicKey, value, style: fontStyle, store })
  );
}

export function styleTextTransformTextDecoration({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, device, state, key });
  const underlineKey = capByPrefix(prefix, "underline");
  const strikeKey = capByPrefix(prefix, "strike");
  const textDecorationKey = capByPrefix(prefix, "textDecoration");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "textDecoration",
    device
  });
  const underline = dvv(underlineKey) ? "underline" : "";
  const strike = dvv(strikeKey) ? "line-through" : "";
  const value = [underline, strike].filter(Boolean).join(" ");

  return (
    globalSize ??
    getOptionFontByGlobal({
      key: textDecorationKey,
      value,
      style: fontStyle,
      store
    })
  );
}

export function styleTextTransformUpperLowerCase({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue) {
  const dvv = (key: string) => defaultValueValue({ v, device, state, key });
  const uppercaseKey = capByPrefix(prefix, "uppercase");
  const lowercaseKey = capByPrefix(prefix, "lowercase");

  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "textTransform",
    device
  });
  const value =
    (dvv(uppercaseKey) && "uppercase") ||
    (dvv(lowercaseKey) && "lowercase") ||
    "inherit";

  return (
    globalSize ??
    getOptionFontByGlobal({ key: uppercaseKey, value, style: fontStyle, store })
  );
}

export function styleTextTransformScript({
  v,
  device,
  state,
  prefix = ""
}: CSSValue) {
  return defaultValueValue({
    v,
    key: capByPrefix(prefix, "script"),
    device,
    state
  });
}
