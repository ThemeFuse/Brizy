import { WithRenderContext } from "visual/providers/RenderProvider";
import { cssStyleFlexColumnVerticalAlign } from "visual/utils/cssStyle/cssStyleAlign";
import { cssStyleBgGradient } from "visual/utils/cssStyle/cssStyleBgGradient";
import {
  cssStyleBgImage,
  cssStyleBgImagePosition
} from "visual/utils/cssStyle/cssStyleBgImage";
import { cssStyleBorder } from "visual/utils/cssStyle/cssStyleBorder";
import { cssStyleBorderRadius } from "visual/utils/cssStyle/cssStyleBorderRadius";
import { cssStyleBoxShadow } from "visual/utils/cssStyle/cssStyleBoxShadow";
import { cssStyleFilter } from "visual/utils/cssStyle/cssStyleFilter";
import { styleBgColor, styleBgGradient } from "visual/utils/style2";
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
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string =>
  cssStyleBgImage({
    v,
    device,
    state,
    store,
    getConfig,
    renderContext,
    prefix: "back"
  });

export const cssStyleElementFlipboxBackBgImagePosition = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string =>
  cssStyleBgImagePosition({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "back"
  });

export const cssStyleElementFlipboxBackBgFilter = ({
  v,
  device,
  state
}: CSSValue): string => cssStyleFilter({ v, device, state, prefix: "back" });

export const cssStyleElementFlipboxBackBgBorder = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string =>
  cssStyleBorder({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "back"
  });

export const cssStyleElementFlipboxBackBgBorderRadius = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string =>
  cssStyleBorderRadius({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "back"
  });

export const cssStyleElementFlipboxBackBgBoxShadow = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string =>
  cssStyleBoxShadow({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "back"
  });

export const cssStyleElementFlipboxBackBgColor = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string => {
  const bgColor = styleBgColor({
    v,
    device,
    state,
    getConfig,
    prefix: "backBg"
  });

  const bgGradient = styleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "backBg"
  });

  return bgColor === undefined || bgGradient !== "none"
    ? "background-color:transparent;"
    : `background-color:${bgColor};`;
};

export const cssStyleElementFlipboxBackBgGradient = ({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string =>
  cssStyleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "back"
  });

export const cssStyleElementFlipboxBackVerticalAlign = ({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string =>
  cssStyleFlexColumnVerticalAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "back"
  });
