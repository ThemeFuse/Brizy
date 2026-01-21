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
import { NORMAL } from "visual/utils/stateMode";
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
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "lost",
    renderContext
  });
}

export function cssStyleElementLoginLostPasswordTypography2FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "lost"
  });
}

export function cssStyleElementLoginLostPasswordTypography2LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "lost"
  });
}

export function cssStyleElementLoginLostPasswordTypography2FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "lost"
  });
}

export function cssStyleElementLoginLostPasswordTextTransform({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "lost"
  });
}

export function cssStyleElementLoginLostPasswordTypography2FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "lost"
  });
}

export function cssStyleElementLoginLostPasswordTypography2LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "lost"
  });
}

// Color Lost Password
export function cssStyleElementLoginLostPasswordColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "lostColor"
  });
}

// Align Lost Password
export function cssStyleElementLoginLostPasswordAlign({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "lost"
  });
}

// Align Remember me
export function cssStyleElementLoginRememberMeAlign({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "rememberMe"
  });
}

// Align Agreement
export function cssStyleElementLoginAgreementAlign({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleFlexHorizontalAlign({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "agreement"
  });
}

export function cssStyleElementLoginAgreementColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "agreementColor"
  });
}

export function cssStyleElementLoginAgreementFontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "agreement",
    renderContext
  });
}

export function cssStyleElementLoginAgreementFontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "agreement"
  });
}

export function cssStyleElementLoginAgreementFontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "agreement"
  });
}

export function cssStyleElementLoginAgreementLetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "agreement"
  });
}

export function cssStyleElementLoginAgreementLineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state: NORMAL,
    store,
    getConfig,
    prefix: "agreement"
  });
}

export function cssStyleElementLoginAgreementFontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "agreement"
  });
}

export function cssStyleElementLoginAgreementTextTransform({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    getConfig,
    store,
    prefix: "agreement"
  });
}

// Align Autorized
export function cssStyleElementLoginAutorizedAlign({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "autorized"
  });
}

export function cssStyleElementLoginTextTypography2FontFamily({
  v,
  device,
  getConfig,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "text",
    renderContext
  });
}

export function cssStyleElementLoginTextTypography2FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "text"
  });
}

export function cssStyleElementLoginTextTypography2LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "text"
  });
}

export function cssStyleElementLoginTextTypography2FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "text"
  });
}

export function cssStyleElementLoginTextTypography2LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    store,
    getConfig,
    prefix: "text"
  });
}

export function cssStyleElementLoginTextTypography2FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "text"
  });
}

export function cssStyleElementLoginTextTransform({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "text"
  });
}

// Color Autorized
export function cssStyleElementLoginTextColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "textColor"
  });
}

export function cssStyleElementLoginLinkColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "linkColor"
  });
}

export function cssStyleElementLoginRegisterInfoTypography2FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "registerInfo",
    renderContext
  });
}

export function cssStyleElementLoginRegisterInfoTypography2FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTypography2LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTypography2FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTypography2LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTypography2FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterInfoTextTransform({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "registerInfo"
  });
}

export function cssStyleElementRegisterInfoColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "registerInfoColor"
  });
}

export function cssStyleElementRegisterInfoAlign({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "registerInfo"
  });
}

export function cssStyleElementLoginRegisterLinkTypography2FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "registerLink",
    renderContext
  });
}

export function cssStyleElementLoginRegisterLinkTypography2FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTypography2LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    getConfig,
    store,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTypography2FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    getConfig,
    store,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTypography2LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTypography2FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkTextTransform({
  v,
  device,
  getConfig,
  store,
  state
}) {
  return cssStyleTextTransforms({
    v,
    device,
    store,
    getConfig,
    state,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkColor({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleColor({
    v,
    device,
    store,
    state,
    getConfig,
    prefix: "registerLinkColor"
  });
}

export function cssStyleElementLoginRegisterLinkAlign({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginLoginLinkTypography2FontFamily({
  v,
  device,
  getConfig,
  store,
  renderContext
}) {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "loginLink",
    renderContext
  });
}

export function cssStyleElementLoginLoginLinkTypography2FontSize({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkTypography2LineHeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LineHeight({
    v,
    device,
    getConfig,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkTypography2FontWeight({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontWeight({
    v,
    device,
    getConfig,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkTypography2LetterSpacing({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    getConfig,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkTypography2FontVariation({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTypography2FontVariation({
    v,
    device,
    getConfig,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkTextTransform({
  v,
  device,
  getConfig,
  store
}) {
  return cssStyleTextTransforms({
    v,
    device,
    getConfig,
    store,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkColor({
  v,
  device,
  state,
  getConfig,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "loginLinkColor"
  });
}

export function cssStyleElementLoginLoginLinkAlign({
  v,
  device,
  store,
  getConfig,
  state
}) {
  return cssStyleTextAlign({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "loginLink"
  });
}
