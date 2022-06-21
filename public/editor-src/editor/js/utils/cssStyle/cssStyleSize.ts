import { CSSValue } from "visual/utils/style2/types";
import { IS_STORY } from "visual/utils/models";
import {
  styleSizeWidth,
  styleSizeHeight,
  styleSizeSize,
  styleSizeContainerSize,
  styleSizeSpacing,
  styleSizeTextSpacing
} from "visual/utils/style2";
import { mApply } from "visual/utils/value";
import * as Str from "visual/utils/string/specs";
import { defaultValueValue } from "visual/utils/onChange";

export function cssStyleSizeWidthPercent(d: CSSValue): string {
  const width = styleSizeWidth(d);

  return width === undefined ? "" : `width:${width}%;`;
}

export function cssStyleSizeWidthPx(d: CSSValue): string {
  const width = styleSizeWidth(d);

  return width === undefined ? "" : `width:${width}px;`;
}
export function cssStyleSizeWidthStoryOnly(d: CSSValue): string {
  const width = styleSizeWidth(d);

  return !IS_STORY || width === undefined ? "" : `width:${width}%;`;
}

export function cssStyleSizeMaxWidthPercent(d: CSSValue): string {
  const width = styleSizeWidth(d);

  return width === undefined ? "" : `max-width:${width}%;`;
}

export function cssStyleSizeHeight(d: CSSValue): string {
  const height = styleSizeHeight(d);
  const unit = Str.read(defaultValueValue({ key: "heightSuffix", ...d }));

  return height === undefined ? "" : `height:${height}${unit || "px"};`;
}

export function cssStyleSizeHeightPx(d: CSSValue): string {
  return mApply(v => `height:${v}px;`, styleSizeHeight(d)) ?? "";
}

export function cssStyleSizeMinHeightPx(d: CSSValue): string {
  return mApply(v => `min-height:${v}px;`, styleSizeHeight(d)) ?? "";
}

export function cssStyleSizeMaxWidthSize(d: CSSValue): string {
  const size = styleSizeSize(d);

  const unit = Str.read(defaultValueValue({ key: "sizeSuffix", ...d })) || "%";

  return size === undefined ? "" : `max-width:${size}${unit};`;
}

export function cssStyleSizeSizePercent(d: CSSValue): string {
  const width = styleSizeSize(d);

  return width === undefined ? "" : `width:${width}%;`;
}

export function cssStyleSizeSize(d: CSSValue): string {
  const width = styleSizeSize(d);
  const unit = Str.read(defaultValueValue({ key: "sizeSuffix", ...d }));

  return width === undefined || !unit ? "" : `width:${width}${unit};`;
}

export function cssStyleSizeWidth(d: CSSValue): string {
  const width = styleSizeWidth(d);
  const unit = Str.read(defaultValueValue({ key: "widthSuffix", ...d }));

  return width === undefined ? "" : `width:${width}${unit || "%"};`;
}

export function cssStyleSizeMaxWidthContainer(d: CSSValue): string {
  const maxWidth = styleSizeContainerSize(d);

  return d.device === "desktop" ? `max-width: ${maxWidth}%;` : "";
}

export function cssStyleSizeSpacing(d: CSSValue): string {
  return mApply(v => `margin-right: ${v}px;`, styleSizeSpacing(d)) ?? "";
}

export function cssStyleSizeTextSpacing(d: CSSValue): string {
  return mApply(v => `margin-right: ${v}px;`, styleSizeTextSpacing(d)) ?? "";
}

/**
 * Return height CSS style only if the unit is in px
 *  - If the unit is in 'px', return the CSS height in px
 *  - If the unit is in 'px', return the CSS height in px
 *  - If value is in %, return 'height: unset'
 *  - otherwise, return empty string
 */
export function cssStyleSizeHeightPxOnly(d: CSSValue): string {
  const unit = Str.read(defaultValueValue({ key: "heightSuffix", ...d }));
  return unit === "px"
    ? mApply(v => `height:${v}${unit};`, styleSizeHeight(d)) ?? ""
    : unit === "%"
    ? "height: unset;"
    : "";
}

/**
 * Return height CSS style only if the unit is in %
 */
export function cssStyleSizeHeightPercentOnly(d: CSSValue): string {
  const unit = Str.read(defaultValueValue({ key: "heightSuffix", ...d }));
  return unit === "%"
    ? mApply(
        v => `content: ""; display:block; width: 0; padding-top:${v}${unit};`,
        styleSizeHeight(d)
      ) ?? ""
    : unit === "px"
    ? "height: unset;"
    : "";
}
