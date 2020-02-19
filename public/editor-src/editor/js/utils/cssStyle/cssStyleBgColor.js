import {
  styleBgColor,
  styleBgColorHex,
  styleBgGradient
} from "visual/utils/style2";

export function cssStyleBgColor({ v, device, state, prefix = "bg" }) {
  const bgColor = styleBgColor({ v, device, state, prefix });

  const bgGradient = styleBgGradient({
    v,
    device,
    state
  });

  return bgColor === undefined || bgGradient !== "none"
    ? ""
    : `background-color:${bgColor};`;
}

export function cssStyleBgColorHex({ v, device, state, prefix = "bg" }) {
  const bgColorHex = styleBgColorHex({ v, device, state, prefix });

  return bgColorHex === undefined ? "" : `background-color:${bgColorHex};`;
}

export function cssStyleBg2Color({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "bg2" });
}
