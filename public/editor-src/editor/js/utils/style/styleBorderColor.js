import { defaultValueValue } from "visual/utils/onChange";
import { getColor } from "visual/utils/color";
import { styleState } from "visual/utils/style";

export function styleBorderColor({ v, device, state }) {
  const isHover = styleState({ v, state }) === "hover";

  const dvv = key => defaultValueValue({ v, key, device, state });
  const dvvH = key => defaultValueValue({ v, key, device, state: "hover" });

  const borderColorHex = dvv("borderColorHex");
  const borderColorPalette = dvv("borderColorPalette");
  const borderColorOpacity = dvv("borderColorOpacity");

  const hoverBorderColorHex = dvvH("borderColorHex");
  const hoverBorderPalette = dvvH("borderColorPalette");
  const hoverBorderColorOpacity = dvvH("borderColorOpacity");

  if (isHover) {
    return getColor(
      hoverBorderPalette,
      hoverBorderColorHex,
      hoverBorderColorOpacity
    );
  } else {
    return getColor(borderColorPalette, borderColorHex, borderColorOpacity);
  }
}
