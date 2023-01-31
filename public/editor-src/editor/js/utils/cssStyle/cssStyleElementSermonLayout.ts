import { CSSValue } from "../style2/types";
import { cssStyleBgColor } from "./cssStyleBgColor";
import { cssStyleBgGradient } from "./cssStyleBgGradient";
import { cssStyleBorder } from "./cssStyleBorder";
import { cssStyleBoxShadow } from "./cssStyleBoxShadow";
import { cssStyleColor } from "./cssStyleColor";
import { getAllCssStyleTypography } from "./cssStyleTypography2";

export const cssStyleElementSermonLayoutButtonsTypography = ({
  v,
  device,
  state
}: CSSValue): string => {
  return getAllCssStyleTypography({
    v,
    device,
    state,
    prefix: "detailButtonTypography"
  });
};

export const cssStyleElementSermonLayoutButtonsBgColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "detailButtonBg"
  });
};

export const cssStyleElementSermonLayoutButtonsBgGradient = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBgGradient({
    v,
    device,
    state,
    prefix: "detailButton"
  });
};

export const cssStyleElementSermonLayoutButtonsColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "detailButtonColor"
  });
};

export const cssStyleElementSermonLayoutButtonsBoxShadow = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBoxShadow({
    v,
    device,
    state,
    prefix: "detailButton"
  });
};

export const cssStyleElementSermonLayoutButtonsBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "detailButton"
  });
};
