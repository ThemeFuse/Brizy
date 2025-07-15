import { Str } from "@brizy/readers";
import * as Num from "visual/utils/math/number";
import * as N from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import * as NoEmptyString from "visual/utils/string/NoEmptyString";
import {
  styleSizeContainerSize,
  styleSizeCustom,
  styleSizeHeight,
  styleSizeSize,
  styleSizeSpacing,
  styleSizeTextSpacing,
  styleSizeWidth
} from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { readIconSize } from "visual/utils/types/Type";
import { MValue, mApply } from "visual/utils/value";
import { checkValue } from "../checkValue";

type Get = (k: string) => MValue<unknown>;
export type Size = "small" | "medium" | "large" | "custom";
export const getSize = checkValue<Size>(["small", "medium", "large", "custom"]);

const getIconSizeValue = (
  iconSize: string,
  iconCustomSize: number
): MValue<number> => {
  switch (readIconSize(iconSize)) {
    case "small": {
      return 16;
    }
    case "medium": {
      return 24;
    }
    case "large": {
      return 32;
    }
    case "custom": {
      return iconCustomSize;
    }
  }
};

export function getButtonSizes(size: Size): MValue<{
  width: number;
  height: number;
}> {
  switch (size) {
    case "small": {
      return {
        width: 26,
        height: 11
      };
    }
    case "medium": {
      return {
        width: 42,
        height: 14
      };
    }
    case "large": {
      return {
        width: 44,
        height: 19
      };
    }
  }
}

export function cssStyleSizeWidth({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeWidth({ v, device, state, getConfig, store, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "widthSuffix"))) || "px";

  return width === undefined ? "" : `width:${width}${unit};`;
}

export function cssStyleSizeWidthPercentOnly({
  v,
  device,
  state,
  store,
  getConfig,
  prefix
}: CSSValue): string {
  const width = styleSizeWidth({ v, device, state, getConfig, store, prefix });

  return width === undefined ? "" : `width:${width}%;`;
}

export function cssStyleSizeWidthPrefix({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = Str.read(dvv(capByPrefix(prefix, "")));
  const unit = Str.read(dvv(capByPrefix(prefix, "suffix"))) || "px";

  return Num.read(width) === undefined ? "" : `width:${width}${unit};`;
}

export function cssStyleSizeWidthStoryOnly({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const width = styleSizeWidth({ v, device, state, getConfig, store, prefix });

  return width === undefined ? "" : `width:${width}%;`;
}

export function cssStyleSizeWidthHeight({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv(capByPrefix(prefix, "size")));
  const customSizeSuffix = Str.read(
    dvv(capByPrefix(prefix, "customSizeSuffix"))
  );
  const customSize = styleSizeCustom({
    v,
    device,
    state,
    getConfig,
    store,
    prefix
  });

  switch (size) {
    case "small":
      return `width:16px;height:16px;`;
    case "medium":
      return `width:24px;height:24px;`;
    case "large":
      return `width:32px;height:32px;`;
    case "custom":
      return `width:${customSize}${customSizeSuffix};height:${customSize}${customSizeSuffix};`;
    case undefined:
      return "";
  }
}

export function cssStyleSizeHeight({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const height = styleSizeHeight({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
  const unit = Str.read(dvv(capByPrefix(prefix, "heightSuffix"))) || "px";

  return height === undefined ? "" : `height:${height}${unit};`;
}

export function cssStyleSizeSizeHeight({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeSize({ v, device, state, store, getConfig, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "sizeSuffix"))) || "px";

  return width === undefined ? "" : `height:${width}${unit};`;
}

/**
 * Return height CSS style only if the unit is in px
 *  - If the unit is in 'px', return the CSS height in px
 *  - If value is in %, return 'height: unset'
 *  - otherwise, return empty string
 */
export function cssStyleSizeHeightPxOnly({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const unit = Str.read(dvv("heightSuffix")) || "px";

  return unit === "px"
    ? (mApply(
        (v) => `height:${v}${unit};`,
        styleSizeHeight({ v, device, state, getConfig, store })
      ) ?? "")
    : unit === "%"
      ? "height: unset;"
      : "";
}

/**
 * Return height CSS style only if the unit is in %
 */
export function cssStyleSizeHeightPercentOnly({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const unit = Str.read(dvv("heightSuffix")) || "px";

  return unit === "%"
    ? (mApply(
        (v) => `content: ""; display:block; width: 0; padding-top:${v}${unit};`,
        styleSizeHeight({ v, device, state, getConfig, store })
      ) ?? "")
    : unit === "px"
      ? "height: unset;"
      : "";
}

export function cssStyleSizeMaxWidth({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeWidth({ v, device, state, getConfig, store, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "widthSuffix"))) || "%";

  return width === undefined
    ? ""
    : `max-width:${width}${NoEmptyString.is(unit) ? unit : "%"};`;
}

export function cssStyleSizeMaxWidthSize({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = styleSizeSize({ v, device, state, getConfig, store, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "sizeSuffix"))) || "%";

  return size === undefined
    ? ""
    : `max-width:${size}${NoEmptyString.is(unit) ? unit : "%"};`;
}

export function cssStyleSizeMaxWidthPrefixEmpty({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = Str.read(dvv(capByPrefix(prefix, "")));
  const unit = Str.read(dvv(capByPrefix(prefix, "suffix"))) ?? "%";

  return Num.read(size) === undefined
    ? ""
    : `max-width:${size}${NoEmptyString.is(unit) ? unit : "%"};`;
}

export function cssStyleSizeMaxWidthContainer({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const maxWidth = styleSizeContainerSize({
    v,
    device,
    getConfig,
    store,
    state
  });

  return device === "desktop" ? `max-width: ${maxWidth}%;` : "";
}

export function cssStyleSizeMinWidth({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeWidth({ v, device, state, getConfig, store, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "widthSuffix"))) || "px";

  return width === undefined ? "" : `min-width:${width}${unit};`;
}

export function cssStyleSizeMinHeightPx({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const height = styleSizeHeight({
    v,
    device,
    state,
    getConfig,
    store,
    prefix
  });
  const unit = Str.read(dvv(capByPrefix(prefix, "heightSuffix"))) || "px";

  return height === undefined ? "" : `min-height:${height}${unit};`;
}

export function cssStyleSizeMinHeightImportant({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const height = styleSizeHeight({
    v,
    device,
    state,
    getConfig,
    store,
    prefix
  });
  const unit = Str.read(dvv(capByPrefix(prefix, "heightSuffix"))) || "px";

  return height === undefined ? "" : `min-height:${height}${unit} !important;`;
}

export function cssStyleSizeSize({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeSize({ v, device, state, getConfig, store, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "sizeSuffix"))) || "px";

  return width === undefined ? "" : `width:${width}${unit};`;
}

export function cssStyleSizeSizePercent({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeSize({ v, device, state, getConfig, store, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "sizeSuffix"))) || "px";

  return width === undefined ? "" : `width:${width}${unit};`;
}

export function cssStyleSizeSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return (
    mApply(
      (v) => `margin-right: ${v}px;`,
      styleSizeSpacing({ v, device, state, getConfig, store })
    ) ?? ""
  );
}

export function cssStyleSizeSpacingWidth({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  const size = styleSizeSpacing({ v, device, state, store, getConfig, prefix });
  const suffix = Str.read(dvv(capByPrefix(prefix, "spacingSuffix"))) || "";

  return size === undefined ? "" : `width:${size}${suffix};`;
}

export function cssStyleSizeIconSizes({ v, device }: CSSValue): string {
  const dvv: Get = (key: string) => defaultValueValue({ v, key, device });
  const size = N.read(dvv("typographyFontSize"));
  const iconSpacing = N.read(dvv("iconSpacing"));
  const suffix = Str.read(dvv("typographyFontSizeSuffix")) || "";

  const res =
    size === undefined || iconSpacing === undefined
      ? ""
      : `${size + iconSpacing}${suffix}`;

  return `width:${res};height:${res};`;
}

export function cssStyleSizeFontSize({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = styleSizeSize({ v, device, state, store, getConfig, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "sizeSuffix"))) || "px";

  return size === undefined ? "" : `font-size:${size}${unit};`;
}

export function cssStyleSizeFontSizeIcon({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv(capByPrefix(prefix, "iconSize")));
  const customSize = dvv(capByPrefix(prefix, "iconCustomSize"));
  const customSizeSuffix = Str.read(
    dvv(capByPrefix(prefix, "iconCustomSizeSuffix"))
  );

  switch (size) {
    case "small":
      return `font-size:16px;`;
    case "medium":
      return `font-size:24px;`;
    case "large":
      return `font-size:32px;`;
    case "custom":
      return `font-size:${customSize}${customSizeSuffix};`;
    case undefined:
      return "";
  }
}

export function cssStyleSizeMinWidthIcon({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv(capByPrefix(prefix, "iconSize")));
  const customSize = dvv(capByPrefix(prefix, "iconCustomSize"));
  const customSizeSuffix = Str.read(
    dvv(capByPrefix(prefix, "iconCustomSizeSuffix"))
  );

  switch (size) {
    case "small":
      return `min-width:16px;`;
    case "medium":
      return `min-width:24px;`;
    case "large":
      return `min-width:32px;`;
    case "custom":
      return `min-width:${customSize}${customSizeSuffix};`;
    case undefined:
      return "";
  }
}

export function cssStyleFontSizeIconOldOption({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv(capByPrefix(prefix, "size")));
  const customSize = dvv(capByPrefix(prefix, "customSize"));
  const customSizeSuffix = Str.read(
    dvv(capByPrefix(prefix, "customSizeSuffix"))
  );

  switch (size) {
    case "small":
      return `font-size:32px;`;
    case "medium":
      return `font-size:48px;`;
    case "large":
      return `font-size:64px;`;
    case "custom":
      return `font-size:${customSize}${customSizeSuffix};`;
    case undefined:
      return "";
  }
}

export function cssStyleSizeTextSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return (
    mApply(
      (v) => `margin-inline-end: ${v}px;`,
      styleSizeTextSpacing({ v, device, state, getConfig, store })
    ) ?? ""
  );
}

export function cssStyleSizePadding({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv(capByPrefix(prefix, "size")));
  const height = styleSizeHeight({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
  const heightSuffix = Str.read(dvv(capByPrefix(prefix, "heightSuffix")));

  switch (size) {
    case "small":
      return "padding: 11px 26px 11px 26px;";
    case "medium":
      return "padding: 14px 42px 14px 42px;";
    case "large":
      return "padding: 19px 44px 19px 44px;";
    case "custom":
      return `padding: ${height}${heightSuffix};`;
    case undefined:
      return "";
  }
}

export function cssStyleSizePaddingSelect({
  v,
  device,
  state,
  getConfig,
  store,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv(capByPrefix(prefix, "size")));
  const height = styleSizeHeight({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
  const heightSuffix = Str.read(dvv(capByPrefix(prefix, "heightSuffix")));

  switch (size) {
    case "small":
      return "padding: 11px 10px;";
    case "medium":
      return "padding: 14px 10px;";
    case "large":
      return "padding: 19px 10px;";
    case "custom":
      return `padding: ${height}${heightSuffix};`;
    case undefined:
      return "";
  }
}

export function cssStyleIconMargin({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const spacing = styleSizeSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
  const iconPosition = dvv(capByPrefix(prefix, "position"));

  return iconPosition === "left"
    ? `margin-inline-end:${spacing}px; margin-inline-start:0;`
    : iconPosition === "right"
      ? `margin-inline-start:${spacing}px; margin-inline-end:0;`
      : "";
}

export function cssStyleIconSize({
  v,
  state,
  device,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const size = Str.read(dvv(capByPrefix(prefix, "iconSize"))) ?? "small";
  const customSize = Num.read(dvv(capByPrefix(prefix, "iconCustomSize"))) ?? 16;
  const iconSize = getIconSizeValue(size, customSize);

  return iconSize ? `font-size:${iconSize}px;` : "";
}

export function cssStyleCustomHeight({
  v,
  device,
  state,
  store,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const heightStyle = Str.read(dvv(capByPrefix(prefix, "heightStyle")));

  if (heightStyle === "custom") {
    return cssStyleSizeMinHeightPx({ v, device, state, getConfig, store });
  } else {
    return "min-height:100%;";
  }
}
