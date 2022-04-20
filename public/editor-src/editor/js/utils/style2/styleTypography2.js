import { capByPrefix } from "visual/utils/string";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getFontById, getFontCssStyle } from "visual/utils/fonts";
import { getOptionFontByGlobal } from "visual/utils/options";

export function styleTypography2FontFamily({ v, device, state, prefix = "" }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const fontFamilyKey = capByPrefix(prefix, "fontFamily");
  const fontFamilyTypeKey = capByPrefix(prefix, "fontFamilyType");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  if (fontStyle) {
    return `var(--brz-${fontStyle}FontFamily)`;
  } else {
    const fontFamily = getOptionFontByGlobal(
      "fontFamily",
      v[fontFamilyKey],
      dvv(fontStyleKey)
    );
    const fontFamilyType = getOptionFontByGlobal(
      "fontFamilyType",
      v[fontFamilyTypeKey],
      dvv(fontStyleKey)
    );

    return getFontById({ type: fontFamilyType, family: fontFamily }).family;
  }
}

export function styleTypography2FontSize({ v, device, state, prefix = "" }) {
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
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
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
  const fontSizeSuffixKey = capByPrefix(prefix, "fontSizeSuffix");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  if (fontStyle) {
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
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
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
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
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
  const dvk = key => defaultValueKey({ key, device, state });
  const dvv = key => defaultValueValue({ v, key, device, state });
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
