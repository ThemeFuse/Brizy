import { getFontStyle } from "visual/utils/fonts";
import { isNumber } from "visual/utils/math";
import { read } from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange/device";
import * as Num from "visual/utils/reader/number";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { Value } from "./types";

export const hasSizing = (
  v: Record<string, unknown>,
  device: ResponsiveMode,
  state: State
): boolean =>
  ["width", "height"]
    .map((key) => defaultValueValue({ v, key, device, state }))
    .map(read)
    .every(isNumber);

export const getMaxBorderRadius = (
  v: Value,
  device: ResponsiveMode
): number => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const paddingTop = Num.read(dvv("paddingTop")) ?? 14;
  const iconCustomSize = Num.read(dvv("iconCustomSize")) ?? 16;
  const tempBorderWidth = Num.read(dvv("tempBorderWidth")) ?? 2;

  // Typography
  const fontStyle = dvv("fontStyle");
  const { fontSize, lineHeight } =
    fontStyle === "" ? v : getFontStyle(fontStyle) || v;

  // Border Radius
  const contentHeight =
    fontSize * lineHeight >= iconCustomSize
      ? fontSize * lineHeight
      : iconCustomSize;

  const maxBorderRadius = Math.round(
    (contentHeight + paddingTop * 2 + tempBorderWidth * 2) / 2
  );

  return maxBorderRadius;
};
