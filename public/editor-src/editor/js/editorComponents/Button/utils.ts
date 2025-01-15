import { Str } from "@brizy/readers";
import classNames from "classnames";
import { getFontStyle } from "visual/utils/fonts";
import { isNumber } from "visual/utils/math";
import { read } from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange/device";
import {
  buttonHoverAnimations,
  buttonHoverInAnimations
} from "visual/utils/options/Animation/utils";
import * as Num from "visual/utils/reader/number";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { Value } from "./types";
import { Store } from "visual/redux/store";

export const hasSizing = (
  v: Record<string, unknown>,
  device: ResponsiveMode,
  state: State
): boolean =>
  ["width", "height"]
    .map((key) => defaultValueValue({ v, key, device, state }))
    .map(read)
    .every(isNumber);

interface Data {
  v: Value;
  device: ResponsiveMode;
  store: Store;
}

export const getMaxBorderRadius = (data: Data): number => {
  const { v, device, store } = data;
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const paddingTop = Num.read(dvv("paddingTop")) ?? 14;
  const iconCustomSize = Num.read(dvv("iconCustomSize")) ?? 16;
  const tempBorderWidth = Num.read(dvv("tempBorderWidth")) ?? 2;

  // Typography
  const fontStyle = Str.read(dvv("fontStyle")) ?? "";
  const style =
    fontStyle === "" ? v : getFontStyle({ id: fontStyle, store }) || v;
  const fontSize = Num.read(style.fontSize) ?? 12;
  const lineHeight = Num.read(style.lineHeight) ?? 1;

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

export const isButtonFillHover = (animationName: string): boolean =>
  buttonHoverAnimations.includes(animationName);

export const getHoverClassName = (hoverName: string): string => {
  const _isButtonFillHover = isButtonFillHover(hoverName);
  return classNames(
    { "brz-btn--hover": _isButtonFillHover },
    { [hoverName]: _isButtonFillHover },
    {
      "brz-btn--hover-in": buttonHoverInAnimations.includes(hoverName)
    }
  );
};
