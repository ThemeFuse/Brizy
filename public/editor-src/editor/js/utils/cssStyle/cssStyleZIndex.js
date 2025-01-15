import { defaultValueValue } from "visual/utils/onChange";
import { styleZIndex } from "visual/utils/style2";

export function cssStyleZIndex({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  const zIndex = styleZIndex({ v, device, state });
  const isRelative = dvv("elementPosition") === "relative";
  const addZ = isRelative ? 0 : 11;

  return zIndex === 0 && isRelative
    ? "z-index: auto;"
    : `z-index: ${zIndex + addZ};`;
}

export function cssStyleZIndexStory({ v, device, state }) {
  const zIndex = styleZIndex({ v, device, state });

  return `z-index: ${zIndex + 1};`;
}
