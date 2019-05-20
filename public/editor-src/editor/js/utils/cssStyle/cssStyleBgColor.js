import { styleBgColor } from "visual/utils/style2";

export function cssStyleBgColor({ v, device, state }) {
  return `background-color:${styleBgColor({
    v,
    device,
    state
  })};`;
}

export function cssStyleBg2Color({ v, device, state }) {
  return `background-color:${styleBgColor({
    v,
    device,
    prefix: "bg2",
    state
  })};`;
}
