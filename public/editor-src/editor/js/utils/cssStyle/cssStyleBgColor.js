import { styleBgColor } from "visual/utils/style2";

export function cssStyleBgColor({ v, device, state }) {
  const bgColor = styleBgColor({
    v,
    device,
    state
  });
  return `background-color:${bgColor};`;
}

export function cssStyleBg2Color({ v, device, state }) {
  const bg2Color = styleBgColor({
    v,
    device,
    prefix: "bg2",
    state
  });
  return `background-color:${bg2Color};`;
}
