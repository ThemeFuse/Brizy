import { CSSValue } from "../style2/types";
import { cssStyleBorder } from "./cssStyleBorder";
import { cssStyleBoxShadow } from "./cssStyleBoxShadow";
import { cssStyleColor } from "./cssStyleColor";
import { cssStyleElementButtonSize } from "./cssStyleElementButton";
import {
  cssStyleElementMinistryBrandsButtonsBgColor,
  cssStyleElementMinistryBrandsButtonsBgGradient
} from "./cssStyleElementMinistryBrands";
import { getAllCssStyleTypography } from "./cssStyleTypography2";

export const cssStyleElementMinistryEventDetailSubscribeEventButtonColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "subscribeEventButtonColor"
  });
};

export const cssStyleElementMinistryEventDetailSubscribeEventButtonTypography =
  ({ v, device, state }: CSSValue): string => {
    return getAllCssStyleTypography({
      v,
      device,
      state,
      prefix: "subscribeEventButtonTypography"
    });
  };

export const cssStyleElementMinistryEventDetailSubscribeEventButtonBgColor = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleElementMinistryBrandsButtonsBgColor({
    v,
    device,
    state,
    prefix: "subscribeEventButton"
  });
};

export const cssStyleElementMinistryEventDetailSubscribeEventButtonBgGradient =
  ({ v, device, state }: CSSValue): string => {
    return cssStyleElementMinistryBrandsButtonsBgGradient({
      v,
      device,
      state,
      prefix: "subscribeEventButton"
    });
  };

export const cssStyleElementMinistryEventDetailSubscribeEventButtonBoxShadow =
  ({ v, device, state }: CSSValue): string => {
    return cssStyleBoxShadow({
      v,
      device,
      state,
      prefix: "subscribeEventButton"
    });
  };

export const cssStyleElementMinistryEventDetailSubscribeEventButtonBorder = ({
  v,
  device,
  state
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    prefix: "subscribeEventButton"
  });
};

export function cssStyleElementMinistryBrandsSubscribeEventSize({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleElementButtonSize({
    v,
    device,
    state,
    prefix: "subscribeEventButton"
  });
}
