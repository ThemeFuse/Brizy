import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { styleState } from "visual/utils/style";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function styleBorderColor({ v, device, state }) {
  const isHover = styleState({ v, state });

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device, state }),
    defaultValueValue({ v, key: "borderColorPalette", device, state })
  );

  const borderColorOpacity = defaultValueValue({
    v,
    key: "borderColorOpacity",
    device,
    state
  });

  const { hex: hoverBorderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device, state: "hover" }),
    defaultValueValue({ v, key: "borderColorPalette", device, state: "hover" })
  );

  const hoverBorderColorOpacity = defaultValueValue({
    v,
    key: "borderColorOpacity",
    device,
    state: "hover"
  });

  return isHover === "hover"
    ? hexToRgba(hoverBorderColorHex, hoverBorderColorOpacity)
    : hexToRgba(borderColorHex, borderColorOpacity);
}
