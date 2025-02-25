import { WithRenderContext } from "visual/providers/RenderProvider";
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
  state,
  store
}: CSSValue): string => {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "subscribeEventButtonColor"
  });
};

export const cssStyleElementMinistryEventDetailSubscribeEventButtonTypography =
  ({
    v,
    device,
    state,
    store,
    renderContext
  }: CSSValue & WithRenderContext): string => {
    return getAllCssStyleTypography({
      v,
      device,
      state,
      store,
      prefix: "subscribeEventButtonTypography",
      renderContext
    });
  };

export const cssStyleElementMinistryEventDetailSubscribeEventButtonBgColor = ({
  v,
  device,
  state,
  store
}: CSSValue): string => {
  return cssStyleElementMinistryBrandsButtonsBgColor({
    v,
    device,
    state,
    store,
    prefix: "subscribeEventButton"
  });
};

export const cssStyleElementMinistryEventDetailSubscribeEventButtonBgGradient =
  ({ v, device, state, store }: CSSValue): string => {
    return cssStyleElementMinistryBrandsButtonsBgGradient({
      v,
      device,
      state,
      store,
      prefix: "subscribeEventButton"
    });
  };

export const cssStyleElementMinistryEventDetailSubscribeEventButtonBoxShadow =
  ({ v, device, state, store }: CSSValue): string => {
    return cssStyleBoxShadow({
      v,
      device,
      state,
      store,
      prefix: "subscribeEventButton"
    });
  };

export const cssStyleElementMinistryEventDetailSubscribeEventButtonBorder = ({
  v,
  device,
  state,
  store
}: CSSValue): string => {
  return cssStyleBorder({
    v,
    device,
    state,
    store,
    prefix: "subscribeEventButton"
  });
};

export function cssStyleElementMinistryBrandsSubscribeEventSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleElementButtonSize({
    v,
    device,
    state,
    store,
    prefix: "subscribeEventButton"
  });
}
