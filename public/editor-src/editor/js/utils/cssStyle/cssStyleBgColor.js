import { styleBgColor, styleBgColorHex } from "visual/utils/style2";

export function cssStyleBgColor({ v, device, state, prefix = "bg" }) {
  const bgColor = styleBgColor({ v, device, state, prefix });

  return bgColor === undefined ? "" : `background-color:${bgColor};`;
}

export function cssStyleBgColorHex({ v, device, state, prefix = "bg" }) {
  const bgColorHex = styleBgColorHex({ v, device, state, prefix });

  return bgColorHex === undefined ? "" : `background-color:${bgColorHex};`;
}

export function cssStyleBg2Color({ v, device, state }) {
  return cssStyleBgColor({ v, device, state, prefix: "bg2" });
}
