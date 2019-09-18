import { styleZIndex } from "visual/utils/style2";

export function cssStyleZIndex({ v, device, state }) {
  const zIndex = styleZIndex({ v, device, state });

  return zIndex === undefined
    ? ""
    : zIndex === 0
    ? "z-index:auto;"
    : `z-index:${zIndex};`;
}

export function cssStyleZIndexMode({ v, device, state, mode = "editor" }) {
  const zIndex = cssStyleZIndex({ v, device, state });

  return (IS_EDITOR && mode === "editor") || (IS_PREVIEW && mode === "preview")
    ? zIndex
    : "";
}
