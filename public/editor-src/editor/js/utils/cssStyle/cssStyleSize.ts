import { IS_STORY } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import * as Str from "visual/utils/string/specs";
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
import { mApply, MValue } from "visual/utils/value";
import { checkValue } from "../checkValue";

type Get = (k: string) => MValue<unknown>;
type Size = "small" | "medium" | "large" | "custom";
export const getSize = checkValue<Size>(["small", "medium", "large", "custom"]);

export function cssStyleSizeWidth({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeWidth({ v, device, state, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "widthSuffix"))) || "px";

  return width === undefined ? "" : `width:${width}${unit};`;
}

export function cssStyleSizeWidthPercentOnly({
  v,
  device,
  state,
  prefix
}: CSSValue): string {
  const width = styleSizeWidth({ v, device, state, prefix });

  return width === undefined ? "" : `width:${width}%;`;
}

export function cssStyleSizeMaxWidthPercentOnly({
  v,
  device,
  state,
  prefix
}: CSSValue): string {
  const width = styleSizeSize({ v, device, state, prefix });

  return width === undefined ? "" : `max-width:${width}%;`;
}

export function cssStyleSizeWidthPrefix({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = Str.read(dvv(capByPrefix(prefix, "")));
  const unit = Str.read(dvv(capByPrefix(prefix, "suffix")));

  return width === undefined ? "" : `width:${width}${unit};`;
}

export function cssStyleSizeWidthStoryOnly({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const width = styleSizeWidth({ v, device, state, prefix });

  return !IS_STORY || width === undefined ? "" : `width:${width}%;`;
}

export function cssStyleSizeWidthHeight({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv(capByPrefix(prefix, "size")));
  const customSizeSuffix = Str.read(
    dvv(capByPrefix(prefix, "customSizeSuffix"))
  );
  const customSize = styleSizeCustom({ v, device, state, prefix });

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
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const height = styleSizeHeight({ v, device, state, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "heightSuffix"))) || "px";

  return height === undefined ? "" : `height:${height}${unit};`;
}

export function cssStyleSizeSizeHeight({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeSize({ v, device, state, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "sizeSuffix")));

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
  state
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const unit = Str.read(dvv("heightSuffix"));

  return unit === "px"
    ? mApply(
        (v) => `height:${v}${unit};`,
        styleSizeHeight({ v, device, state })
      ) ?? ""
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
  state
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const unit = Str.read(dvv("heightSuffix"));

  return unit === "%"
    ? mApply(
        (v) => `content: ""; display:block; width: 0; padding-top:${v}${unit};`,
        styleSizeHeight({ v, device, state })
      ) ?? ""
    : unit === "px"
    ? "height: unset;"
    : "";
}

export function cssStyleSizeMaxWidth({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeWidth({ v, device, state, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "widthSuffix")));

  return width === undefined ? "" : `max-width:${width}${unit};`;
}

export function cssStyleSizeMaxWidthSize({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = styleSizeSize({ v, device, state, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "sizeSuffix")));

  return size === undefined ? "" : `max-width:${size}${unit};`;
}

export function cssStyleSizeMaxWidthPrefixEmpty({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = Str.read(dvv(capByPrefix(prefix, "")));
  const unit = Str.read(dvv(capByPrefix(prefix, "suffix")));

  return size === undefined ? "" : `max-width:${size}${unit};`;
}

export function cssStyleSizeMaxWidthContainer({
  v,
  device,
  state
}: CSSValue): string {
  const maxWidth = styleSizeContainerSize({ v, device, state });

  return device === "desktop" ? `max-width: ${maxWidth}%;` : "";
}

export function cssStyleSizeMinWidth({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeWidth({ v, device, state, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "widthSuffix")));

  return width === undefined ? "" : `min-width:${width}${unit};`;
}

export function cssStyleSizeMinHeightPx({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const height = styleSizeHeight({ v, device, state, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "heightSuffix")));

  return height === undefined ? "" : `min-height:${height}${unit};`;
}

export function cssStyleSizeSize({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeSize({ v, device, state, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "sizeSuffix")));

  return width === undefined ? "" : `width:${width}${unit};`;
}

export function cssStyleSizeSizePercent({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const width = styleSizeSize({ v, device, state, prefix });
  const unit = Str.read(dvv(capByPrefix(prefix, "sizeSuffix")));

  return width === undefined ? "" : `width:${width}${unit};`;
}

export function cssStyleSizeSpacing({ v, device, state }: CSSValue): string {
  return (
    mApply(
      (v) => `margin-right: ${v}px;`,
      styleSizeSpacing({ v, device, state })
    ) ?? ""
  );
}

export function cssStyleSizeSpacingWidth({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  const size = styleSizeSpacing({ v, device, state, prefix });
  const suffix = Str.read(dvv(capByPrefix(prefix, "spacingSuffix")));

  return size === undefined ? "" : `width:${size}${suffix};`;
}

export function cssStyleSizeSpacingHeight({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  const size = styleSizeSpacing({ v, device, state, prefix });
  const suffix = Str.read(dvv(capByPrefix(prefix, "spacingSuffix")));

  return size === undefined ? "" : `height:${size}${suffix};`;
}

export function cssStyleSizeFontSize({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = styleSizeSize({ v, device, state, prefix });
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
  state
}: CSSValue): string {
  return (
    mApply(
      (v) => `margin-right: ${v}px;`,
      styleSizeTextSpacing({ v, device, state })
    ) ?? ""
  );
}

export function cssStyleSizePadding({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });
  const size = getSize(dvv(capByPrefix(prefix, "size")));
  const height = styleSizeHeight({ v, device, state, prefix });
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

export function cssStyleIconMargin({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const spacing = styleSizeSpacing({ v, device, state, prefix });
  const iconPosition = dvv(capByPrefix(prefix, "position"));

  return iconPosition === "left"
    ? `margin-right:${spacing}px; margin-left:0;`
    : iconPosition === "right"
    ? `margin-left:${spacing}px; margin-right:0;`
    : "";
}
