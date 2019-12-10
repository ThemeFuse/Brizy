import { styleIconSize, styleIconSpacing } from "visual/utils/style2";

export function cssStyleIconSpacing({ v, device, state }) {
  return `margin-right: ${styleIconSpacing({
    v,
    device,
    state
  })}px;`;
}

export function cssStyleIconSize({ v, device, state }) {
  const customSize = styleIconSize({ v, device, state });

  return customSize === undefined ? "" : `font-size:${customSize}px;`;
}
