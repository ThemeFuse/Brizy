import {
  styleSizeWidthPercent,
} from "visual/utils/style2";

export function cssStyleSizeWidthPercent({ v, device, state }) {
  return `width:${styleSizeWidthPercent({ v, device, state })};`;
}

