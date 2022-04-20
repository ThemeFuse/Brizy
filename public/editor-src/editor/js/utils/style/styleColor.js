import { defaultValueValue } from "visual/utils/onChange";
import { getColor } from "visual/utils/color";
import { styleState } from "visual/utils/style";

export function styleColor({ v, device, state, prefix = "color" }) {
  const isHover = styleState({ v, state }) === "hover";

  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvvH = key => defaultValueValue({ v, key, device, state: "hover" });

  const colorHex = dvv(`${prefix}Hex`);
  const colorPalette = dvv(`${prefix}Palette`);
  const colorOpacity = dvv(`${prefix}Opacity`);

  const hoverColorHex = dvvH(`${prefix}Hex`);
  const hoverColorPalette = dvvH(`${prefix}Palette`);
  const hoverColorOpacity = dvvH(`${prefix}Opacity`);

  if (isHover) {
    return getColor(hoverColorPalette, hoverColorHex, hoverColorOpacity);
  } else {
    return getColor(colorPalette, colorHex, colorOpacity);
  }
}
