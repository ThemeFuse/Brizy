import Config from "visual/global/Config";
import { getFontCssStyle } from "visual/utils/fonts";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";
import { getDetailsModelFontFamily } from "visual/utils/options/getDetailsModelFontFamily";
import { read as readStr } from "visual/utils/reader/string";
import { capByPrefix } from "visual/utils/string";
import { isNullish } from "visual/utils/value";

export function styleTypography2FontFamily({ v, device, state, prefix = "" }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const fontFamilyKey = capByPrefix(prefix, "fontFamily");
  const fontFamilyTypeKey = capByPrefix(prefix, "fontFamilyType");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = readStr(dvv(fontStyleKey));
  const family = readStr(v[fontFamilyKey]);
  const familyType = readStr(v[fontFamilyTypeKey]);

  if (isNullish(family) || isNullish(familyType)) {
    return "";
  }

  return getDetailsModelFontFamily(
    {
      family,
      familyType,
      style: fontStyle
    },
    Config.getAll()
  );
}

export function styleTypography2FontSize({ v, device, state, prefix = "" }) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontSizeKey = capByPrefix(prefix, "fontSize");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({ fontStyle, key: "fontSize", device });

  return (
    globalSize ??
    getOptionFontByGlobal(dvk("fontSize"), dvv(fontSizeKey), dvv(fontStyleKey))
  );
}

export function styleTypography2FontSizeSuffix({
  v,
  device,
  state,
  prefix = ""
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const fontSizeSuffixKey = capByPrefix(prefix, "fontSizeSuffix");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  if (fontStyle && fontStyle !== "custom") {
    return "";
  } else {
    return (
      getOptionFontByGlobal(
        dvk("fontSizeSuffix"),
        dvv(fontSizeSuffixKey),
        dvv(fontStyleKey)
      ) || "px"
    );
  }
}

export function styleTypography2LineHeight({ v, device, state, prefix = "" }) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const lineHeightKey = capByPrefix(prefix, "lineHeight");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({ fontStyle, key: "lineHeight", device });

  return (
    globalSize ??
    getOptionFontByGlobal(
      dvk("lineHeight"),
      dvv(lineHeightKey),
      dvv(fontStyleKey)
    )
  );
}

export function styleTypography2FontWeight({ v, device, state, prefix = "" }) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontWeightKey = capByPrefix(prefix, "fontWeight");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({ fontStyle, key: "fontWeight", device });

  return (
    globalSize ??
    getOptionFontByGlobal(
      dvk("fontWeight"),
      dvv(fontWeightKey),
      dvv(fontStyleKey)
    )
  );
}

export function styleTypography2LetterSpacing({
  v,
  device,
  state,
  prefix = ""
}) {
  const dvk = (key) => defaultValueKey({ key, device, state });
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);
  const letterSpacingKey = capByPrefix(prefix, "letterSpacing");
  const suffix = fontStyle ? "" : "px";

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "letterSpacing",
    device
  });

  return (
    globalSize ??
    `${getOptionFontByGlobal(
      dvk("letterSpacing"),
      dvv(letterSpacingKey),
      dvv(fontStyleKey)
    )}${suffix}`
  );
}
