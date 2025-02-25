import { Str } from "@brizy/readers";
import { WithRenderContext } from "visual/providers/RenderProvider";
import { configSelector } from "visual/redux/selectors";
import { FontFamilyType } from "visual/types/Fonts";
import { DESKTOP, Device } from "visual/utils/devices";
import { getFontCssStyle } from "visual/utils/fonts/getFontCssStyle";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { getOptionFontByGlobal } from "visual/utils/options";
import { getDetailsModelFontFamily } from "visual/utils/options/getDetailsModelFontFamily";
import { read as readStr } from "visual/utils/reader/string";
import { NORMAL } from "visual/utils/stateMode";
import { capByPrefix } from "visual/utils/string";
import { MValue, isNullish } from "visual/utils/value";
import { CSSValue } from "./types";
import { isCustomFontStyle } from "./utils";

export function styleTypography2FontFamily({
  v,
  device,
  state,
  store,
  prefix = "",
  renderContext
}: CSSValue & WithRenderContext) {
  if (!store) {
    throw Error("Missing Store");
  }
  const dvv = (key: string, deviceMode?: Device) =>
    defaultValueValue({ v, key, device: deviceMode ?? device, state });
  const dvk = (key: string, deviceMode?: Device) =>
    defaultValueKey({ key, device: deviceMode ?? device, state: NORMAL });

  const fontFamilyKey = dvk(capByPrefix(prefix, "fontFamily"));
  const fontFamilyDesktopKey = dvk(capByPrefix(prefix, "fontFamily"), DESKTOP);
  const fontFamilyTypeKey = dvk(capByPrefix(prefix, "fontFamilyType"));
  const fontFamilyTypeDesktopKey = dvk(
    capByPrefix(prefix, "fontFamilyType"),
    DESKTOP
  );
  const fontStyleKey = capByPrefix(prefix, "fontStyle");

  let fontStyle = readStr(dvv(fontStyleKey));
  const desktopFontStyle = readStr(dvv(fontStyleKey, DESKTOP));

  /* The given condition is required when the device is responsive. Because for responsive mode we don't have the value
  for fontFamily, when fontStyle is `custom` it tries to take the value from desktop, but if fontStyle is set for
  desktop from globalStyling then fontFamily for responsive mode will be taken from the default. To prevent this
  behavior we need to assign fontStyle when device mode is responsive the value from desktop fontStyle */
  if (
    device !== DESKTOP &&
    Str.is(fontStyle) &&
    isCustomFontStyle(fontStyle) &&
    Str.is(desktopFontStyle) &&
    !isCustomFontStyle(desktopFontStyle)
  ) {
    fontStyle = desktopFontStyle;
  }

  const family = readStr(v[fontFamilyKey] ?? dvv(fontFamilyDesktopKey));
  const familyType = readStr(
    v[fontFamilyTypeKey] ?? dvv(fontFamilyTypeDesktopKey)
  ) as MValue<FontFamilyType>;

  if (isNullish(family) || isNullish(familyType)) {
    return "";
  }

  const config = configSelector(store.getState());

  return getDetailsModelFontFamily({
    data: {
      family,
      familyType,
      store,
      style: fontStyle
    },
    config,
    renderContext
  });
}

export function styleTypography2FontSize({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): number {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontSizeKey = capByPrefix(prefix, "fontSize");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "fontSize",
    device,
    config
  });
  const value =
    globalSize ??
    getOptionFontByGlobal({
      key: dvk("fontSize"),
      value: dvv(fontSizeKey),
      style: dvv(fontStyleKey),
      store
    });

  return value as number;
}

export function styleTypography2FontSizeSuffix({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const fontSizeSuffixKey = capByPrefix(prefix, "fontSizeSuffix");
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);

  if (fontStyle && fontStyle !== "custom") {
    return "";
  } else {
    const value =
      getOptionFontByGlobal({
        key: dvk("fontSizeSuffix"),
        value: dvv(fontSizeSuffixKey),
        style: dvv(fontStyleKey),
        store
      }) || "px";
    return value as string;
  }
}

export function styleTypography2LineHeight({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const lineHeightKey = capByPrefix(prefix, "lineHeight");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "lineHeight",
    device,
    config
  });
  const value =
    globalSize ??
    getOptionFontByGlobal({
      key: dvk("lineHeight"),
      value: dvv(lineHeightKey),
      style: dvv(fontStyleKey),
      store
    });

  return Str.read(value) ?? "";
}

export function styleTypography2FontWeight({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontWeightKey = capByPrefix(prefix, "fontWeight");
  const fontStyle = dvv(fontStyleKey);

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "fontWeight",
    device,
    config
  });
  const value =
    globalSize ??
    getOptionFontByGlobal({
      key: dvk("fontWeight"),
      value: dvv(fontWeightKey),
      style: dvv(fontStyleKey),
      store
    });

  return Str.read(value) ?? "";
}

export function styleTypography2LetterSpacing({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const dvk = (key: string) => defaultValueKey({ key, device, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const fontStyle = dvv(fontStyleKey);
  const letterSpacingKey = capByPrefix(prefix, "letterSpacing");
  const suffix = fontStyle ? "" : "px";

  const globalSize = getFontCssStyle({
    fontStyle,
    key: "letterSpacing",
    device,
    config
  });

  return (
    globalSize ??
    `${getOptionFontByGlobal({
      key: dvk("letterSpacing"),
      value: dvv(letterSpacingKey),
      style: dvv(fontStyleKey),
      store
    })}${suffix}`
  );
}

export function styleTypography2FontVariation({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const fontStyleKey = capByPrefix(prefix, "fontStyle");
  const variableFontWeightKey = capByPrefix(prefix, "variableFontWeight");
  const fontWidthKey = capByPrefix(prefix, "fontWidth");
  const fontSoftnessKey = capByPrefix(prefix, "fontSoftness");
  const fontStyle = dvv(fontStyleKey);
  const fontVariationKey = defaultValueKey({
    key: "fontVariation",
    device,
    state
  });
  const globalSize = getFontCssStyle({
    fontStyle,
    key: "fontVariation",
    device,
    config
  });

  const value = `"wght" ${dvv(variableFontWeightKey)}, "wdth" ${dvv(
    fontWidthKey
  )}, "SOFT" ${dvv(fontSoftnessKey)}`;

  const _value =
    globalSize ??
    getOptionFontByGlobal({
      key: fontVariationKey,
      value,
      style: dvv(fontStyleKey),
      store
    });

  return Str.read(_value) ?? "";
}
