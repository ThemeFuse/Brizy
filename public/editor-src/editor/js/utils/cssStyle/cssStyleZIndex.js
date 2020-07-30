import { styleZIndex } from "visual/utils/style2";
import { defaultValueValue } from "visual/utils/onChange";

export function cssStyleZIndex({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  const zIndex = styleZIndex({ v, device, state });
  const isRelative = dvv("elementPosition") === "relative";
  const addZ = isRelative ? 0 : 11;

  return zIndex === 0 && isRelative
    ? "z-index: auto;"
    : `z-index: ${zIndex + addZ};`;
}

export function cssStyleZIndexMode({ v, device, state, mode = "editor" }) {
  const zIndex = cssStyleZIndex({ v, device, state });

  return (IS_EDITOR && mode === "editor") || (IS_PREVIEW && mode === "preview")
    ? zIndex
    : "";
}
