import { CSSValue } from "../style2/types";
import { cssStyleBgColor } from "./cssStyleBgColor";
import { cssStyleBgGradient } from "./cssStyleBgGradient";
import { cssStyleBorder } from "./cssStyleBorder";
import { cssStyleBoxShadow } from "./cssStyleBoxShadow";
import { cssStyleColor } from "./cssStyleColor";
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
  return cssStyleBgColor({
    v,
    device,
    state,
    prefix: "subscribeEventButtonBg"
  });
};

export const cssStyleElementMinistryEventDetailSubscribeEventButtonBgGradient =
  ({ v, device, state }: CSSValue): string => {
    return cssStyleBgGradient({
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
