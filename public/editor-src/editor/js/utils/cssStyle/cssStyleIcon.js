import { styleIconSpacing } from "visual/utils/style2";
import { defaultValueValue } from "visual/utils/onChange";

export function cssStyleIconSpacing({ v, device, state }) {
  return `margin-right: ${styleIconSpacing({
    v,
    device,
    state
  })}px;`;
}

export function cssStyleIconSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const iconSize = dvv("iconSize");
  const iconCustomSize = dvv("iconCustomSize");

  switch (iconSize) {
    case "small":
      return "font-size: 16px;";
    case "medium":
      return "font-size: 24px;";
    case "large":
      return "font-size: 32px;";
    case "custom":
      return `font-size: ${iconCustomSize}px;`;
  }
}
