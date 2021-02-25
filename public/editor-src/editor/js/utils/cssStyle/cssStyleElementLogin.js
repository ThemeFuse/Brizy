import { cssStylePadding } from "visual/utils/cssStyle";
import {
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle/cssStyleTypography2";
import { cssStyleColor } from "visual/utils/cssStyle";
import { styleAlignHorizontal } from "visual/utils/style2";

export function cssStyleElementLoginFormMargin({ v, device, state }) {
  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft
  } = cssStylePadding({ v, device, state, prefix: "field" });

  return paddingTop === undefined ||
    paddingRight === undefined ||
    paddingBottom === undefined ||
    paddingLeft === undefined
    ? ""
    : `margin:-${paddingTop}px -${paddingRight / 2}px
       -${paddingBottom}px -${paddingLeft / 2}px;`;
}

export function cssStyleElementLoginFieldPadding({ v, device, state }) {
  const {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    paddingTopSuffix,
    paddingRightSuffix,
    paddingBottomSuffix,
    paddingLeftSuffix
  } = cssStylePadding({ v, device, state, prefix: "field" });

  return paddingTop === undefined ||
    paddingRight === undefined ||
    paddingBottom === undefined ||
    paddingLeft === undefined
    ? ""
    : `padding:${paddingTop}${paddingTopSuffix}
      ${paddingRight / 2}${paddingRightSuffix}
      ${paddingBottom}${paddingBottomSuffix}
      ${paddingLeft / 2}${paddingLeftSuffix};`;
}

// Style Typography Lost Password
export function cssStyleElementLoginLostPasswordTypography2FontFamily({
  v,
  device
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "lost" });
}

export function cssStyleElementLoginLostPasswordTypography2FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "lost" });
}

export function cssStyleElementLoginLostPasswordTypography2LineHeight({
  v,
  device
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "lost" });
}

export function cssStyleElementLoginLostPasswordTypography2FontWeight({
  v,
  device
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "lost" });
}

export function cssStyleElementLoginLostPasswordTypography2LetterSpacing({
  v,
  device
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "lost" });
}

// Color Lost Password
export function cssStyleElementLoginLostPasswordColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "lostColor" });
}

// Align Lost Password
export function cssStyleElementLoginLostPasswordAlign({ v, device, state }) {
  const align = styleAlignHorizontal({ v, device, state, prefix: "lost" });

  return align === undefined ? "" : `text-align:${align};`;
}

// Align Autorized
export function cssStyleElementLoginAutorizedAlign({ v, device, state }) {
  const align = styleAlignHorizontal({ v, device, state, prefix: "autorized" });

  return align === undefined ? "" : `text-align:${align};`;
}

export function cssStyleElementLoginTextTypography2FontFamily({ v, device }) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "text" });
}

export function cssStyleElementLoginTextTypography2FontSize({ v, device }) {
  return cssStyleTypography2FontSize({ v, device, prefix: "text" });
}

export function cssStyleElementLoginTextTypography2LineHeight({ v, device }) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "text" });
}

export function cssStyleElementLoginTextTypography2FontWeight({ v, device }) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "text" });
}

export function cssStyleElementLoginTextTypography2LetterSpacing({
  v,
  device
}) {
  return cssStyleTypography2LetterSpacing({ v, device, prefix: "text" });
}

// Color Autorized
export function cssStyleElementLoginTextColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "textColor" });
}

export function cssStyleElementLoginLinkColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "linkColor" });
}

export function cssStyleElementLoginRegisterInfoTypography2FontFamily({
  v,
  device
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "registerInfo" });
}

export function cssStyleElementLoginRegisterInfoTypography2FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "registerInfo" });
}

export function cssStyleElementLoginRegisterInfoTypography2LineHeight({
  v,
  device
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "registerInfo" });
}

export function cssStyleElementLoginRegisterInfoTypography2FontWeight({
  v,
  device
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "registerInfo" });
}

export function cssStyleElementLoginRegisterInfoTypography2LetterSpacing({
  v,
  device
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    prefix: "registerInfo"
  });
}

export function cssStyleElementRegisterInfoColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "registerInfoColor" });
}

export function cssStyleElementRegisterInfoAlign({ v, device, state }) {
  const align = styleAlignHorizontal({
    v,
    device,
    state,
    prefix: "registerInfo"
  });

  return align === undefined ? "" : `text-align:${align};`;
}

export function cssStyleElementLoginRegisterLinkTypography2FontFamily({
  v,
  device
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "registerLink" });
}

export function cssStyleElementLoginRegisterLinkTypography2FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "registerLink" });
}

export function cssStyleElementLoginRegisterLinkTypography2LineHeight({
  v,
  device
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "registerLink" });
}

export function cssStyleElementLoginRegisterLinkTypography2FontWeight({
  v,
  device
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "registerLink" });
}

export function cssStyleElementLoginRegisterLinkTypography2LetterSpacing({
  v,
  device
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    prefix: "registerLink"
  });
}

export function cssStyleElementLoginRegisterLinkColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "registerLinkColor" });
}

export function cssStyleElementLoginRegisterLinkAlign({ v, device, state }) {
  const align = styleAlignHorizontal({
    v,
    device,
    state,
    prefix: "registerLink"
  });

  return align === undefined ? "" : `text-align:${align};`;
}

export function cssStyleElementLoginLoginLinkTypography2FontFamily({
  v,
  device
}) {
  return cssStyleTypography2FontFamily({ v, device, prefix: "loginLink" });
}

export function cssStyleElementLoginLoginLinkTypography2FontSize({
  v,
  device
}) {
  return cssStyleTypography2FontSize({ v, device, prefix: "loginLink" });
}

export function cssStyleElementLoginLoginLinkTypography2LineHeight({
  v,
  device
}) {
  return cssStyleTypography2LineHeight({ v, device, prefix: "loginLink" });
}

export function cssStyleElementLoginLoginLinkTypography2FontWeight({
  v,
  device
}) {
  return cssStyleTypography2FontWeight({ v, device, prefix: "loginLink" });
}

export function cssStyleElementLoginLoginLinkTypography2LetterSpacing({
  v,
  device
}) {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    prefix: "loginLink"
  });
}

export function cssStyleElementLoginLoginLinkColor({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "loginLinkColor" });
}

export function cssStyleElementLoginLoginLinkAlign({ v, device, state }) {
  const align = styleAlignHorizontal({
    v,
    device,
    state,
    prefix: "loginLink"
  });

  return align === undefined ? "" : `text-align:${align};`;
}
