import { cssStyleColor } from "visual/utils/cssStyle";
import {
  styleElementWPPostInfoLarge,
  styleSizeTextSpacing,
  styleTypography2FontSize
} from "visual/utils/style2";

export function cssStyleElementPostInfoIconSize({ v, device, state }) {
  return `font-size: ${styleTypography2FontSize({ v, device, state })}px;`;
}

export function cssStyleElementPostInfoColorIcons({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "iconsColor"
  });
}

export function cssStyleElementPostInfoColorText({ v, device, state }) {
  return cssStyleColor({
    v,
    device,
    state,
    prefix: "textColor"
  });
}

export function cssStyleElementPostInfoSpacing({ v, device, state }) {
  const large = styleElementWPPostInfoLarge({ v, device });

  return large === "inline"
    ? `margin-right: ${styleSizeTextSpacing({
        v,
        device,
        state
      })}px;`
    : `margin-top: ${styleSizeTextSpacing({
        v,
        device,
        state
      })}px;`;
}
