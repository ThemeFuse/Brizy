import { cssStyleFlexColumnVerticalAlign } from "visual/utils/cssStyle/cssStyleAlign";
import { cssStyleBgColor } from "visual/utils/cssStyle/cssStyleBgColor";
import { cssStyleBgGradient } from "visual/utils/cssStyle/cssStyleBgGradient";
import {
  cssStyleBgImage,
  cssStyleBgImagePosition
} from "visual/utils/cssStyle/cssStyleBgImage";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import { cssStyleFilter } from "visual/utils/cssStyle/cssStyleFilter";
import { CSSValue } from "../style2/types";
import { cssStylePaddingFourFields } from "./cssStylePadding";

export const cssStyleElementFlipboxTransitionSpeed = ({
  v
}: CSSValue): string => {
  const { speed, speedSuffix } = v;
  return `transition-duration:${speed}${speedSuffix};`;
};

export const cssStyleElementFlipboxFrontPadding = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStylePaddingFourFields({ v, device, state, prefix: "front" });
};

export const cssStyleElementFlipboxBackPadding = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStylePaddingFourFields({ v, device, state, prefix: "back" });
};

export const cssStyleElementFlipboxBackBgImage = ({
  v,
  device,
  state
}: CSSValue): string => cssStyleBgImage({ v, device, state, prefix: "back" });

export const cssStyleElementFlipboxBackBgImagePosition = ({
  v,
  device,
  state
}: CSSValue): string =>
  cssStyleBgImagePosition({ v, device, state, prefix: "back" });

export const cssStyleElementFlipboxBackBgFilter = ({
  v,
  device,
  state
}: CSSValue): string => cssStyleFilter({ v, device, state, prefix: "back" });

export const cssStyleElementFlipboxBackBgBorder = ({
  v,
  device,
  state
}: CSSValue): string => cssStyleBorder({ v, device, state, prefix: "back" });

export const cssStyleElementFlipboxBackBgBorderRadius = ({
  v,
  device,
  state
}: CSSValue): string =>
  cssStyleBorderRadius({ v, device, state, prefix: "back" });

export const cssStyleElementFlipboxBackBgBoxShadow = ({
  v,
  device,
  state
}: CSSValue): string => cssStyleBoxShadow({ v, device, state, prefix: "back" });

export const cssStyleElementFlipboxBackBgColor = ({
  v,
  device,
  state
}: CSSValue): string => cssStyleBgColor({ v, device, state, prefix: "backBg" });

export const cssStyleElementFlipboxBackBgGradient = ({
  v,
  device,
  state
}: CSSValue): string =>
  cssStyleBgGradient({ v, device, state, prefix: "back" });

export const cssStyleElementFlipboxBackVerticalAlign = ({
  v,
  device,
  state
}: CSSValue): string =>
  cssStyleFlexColumnVerticalAlign({ v, device, state, prefix: "back" });
