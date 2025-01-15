import {
  cssStyleColor,
  cssStyleFlexHorizontalAlign,
  cssStyleTextTransforms,
  cssStyleTypography2FontVariation
} from "visual/utils/cssStyle";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";
import { defaultValueValue } from "../onChange";
import { cssStyleTextAlign } from "./cssStyleAlign";

export function cssStyleElementLoginFormMargin({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const padding = dvv("fieldPadding");
  const paddingSuffix = dvv("fieldPaddingSuffix");
  return padding === undefined
    ? ""
    : `margin:-${padding}${paddingSuffix} -${padding / 2}${paddingSuffix}
       -${padding}${paddingSuffix} -${padding / 2}${paddingSuffix};`;
}

export function cssStyleElementLoginFieldPadding({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const padding = dvv("fieldPadding");
  const paddingSuffix = dvv("fieldPaddingSuffix");

  return padding === undefined
    ? ""
    : `padding:0
      ${padding / 2}${paddingSuffix}
      ${padding}${paddingSuffix}
      ${padding / 2}${paddingSuffix};`;
}

export function cssStyleElementFieldsInputSize({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const size = dvv("size");

  const sizeToPadding = {
    small: dvv("sizeSmallPadding"),
    medium: dvv("sizeMediumPadding"),
    large: dvv("sizeLargePadding")
  };

  return `padding: ${sizeToPadding[size]}px ${sizeToPadding[size] + 10}px;`;
}

// Style Typography Lost Password
export function cssStyleElementLoginLostPasswordTypography2FontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "lost",
    renderContext
  });
}

export function cssStyleElementLoginLostPasswordTypography2FontSize({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "lost" });
}

export function cssStyleElementLoginLostPasswordTypography2LineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "lost" });
}

export function cssStyleElementLoginLostPasswordTypography2FontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "lost" });
}

export function cssStyleElementLoginLostPasswordTextTransform({
  v,
  device,
  state,
  store
}) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "lost" });
}

export function cssStyleElementLoginLostPasswordTypography2FontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "lost" });
}

export function cssStyleElementLoginLostPasswordTypography2LetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({ v, device, store, prefix: "lost" });
}

// Color Lost Password
export function cssStyleElementLoginLostPasswordColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "lostColor" });
}

// Align Lost Password
export function cssStyleElementLoginLostPasswordAlign({
  v,
  device,
  state,
  store
}) {
  return cssStyleTextAlign({ v, device, state, store, prefix: "lost" });
}

// Align Remember me
export function cssStyleElementLoginRememberMeAlign({
  v,
  device,
  state,
  store
}) {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    store,
    prefix: "rememberMe"
  });
}

// Align Autorized
export function cssStyleElementLoginAutorizedAlign({
  v,
  device,
  state,
  store
}) {
  return cssStyleTextAlign({ v, device, state, store, prefix: "autorized" });
}

export function cssStyleElementLoginTextTypography2FontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "text",
    renderContext
  });
}

export function cssStyleElementLoginTextTypography2FontSize({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "text" });
}

export function cssStyleElementLoginTextTypography2LineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "text" });
}

export function cssStyleElementLoginTextTypography2FontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "text" });
}

export function cssStyleElementLoginTextTypography2LetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({ v, device, store, prefix: "text" });
}

export function cssStyleElementLoginTextTypography2FontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "text" });
}

export function cssStyleElementLoginTextTransform({ v, device, state, store }) {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "text" });
}

// Color Autorized
export function cssStyleElementLoginTextColor({ v, device, state, store }) {
  return cssStyleColor({ v, device, state, store, prefix: "textColor" });
}

export function cssStyleElementLoginLinkColor({ v, device, state, store }) {
  return cssStyleColor({ v, device, state, store, prefix: "linkColor" });
}

export function cssStyleElementLoginRegisterInfoTypography2FontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "registerInfo",
    renderContext
  });
}

export function cssStyleElementLoginRegisterInfoTypography2FontSize({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTypography2LineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTypography2FontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTypography2LetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTypography2FontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTextTransform({
  v,
  device,
  store,
  state
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    state,
    prefix: "registerInfo"
  });
}

export function cssStyleElementRegisterInfoColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "registerInfoColor" });
}

export function cssStyleElementRegisterInfoAlign({ v, device, store, state }) {
  return cssStyleTextAlign({ v, device, state, store, prefix: "registerInfo" });
}

export function cssStyleElementLoginRegisterLinkTypography2FontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "registerLink",
    renderContext
  });
}

export function cssStyleElementLoginRegisterLinkTypography2FontSize({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTypography2LineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTypography2FontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTypography2LetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTypography2FontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTextTransform({
  v,
  device,
  store,
  state
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    state,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkColor({
  v,
  device,
  store,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    prefix: "registerLinkColor"
  });
}

export function cssStyleElementLoginRegisterLinkAlign({
  v,
  device,
  store,
  state
}) {
  return cssStyleTextAlign({ v, device, state, store, prefix: "registerLink" });
}

export function cssStyleElementLoginLoginLinkTypography2FontFamily({
  v,
  device,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "loginLink",
    renderContext
  });
}

export function cssStyleElementLoginLoginLinkTypography2FontSize({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "loginLink" });
}

export function cssStyleElementLoginLoginLinkTypography2LineHeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkTypography2FontWeight({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkTypography2LetterSpacing({
  v,
  device,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkTypography2FontVariation({
  v,
  device,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkTextTransform({
  v,
  device,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "loginLinkColor" });
}

export function cssStyleElementLoginLoginLinkAlign({
  v,
  device,
  store,
  state
}) {
  return cssStyleTextAlign({ v, device, state, store, prefix: "loginLink" });
}
