import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { styleState } from "visual/utils/style";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function styleColor({ v, device, state, prefix = "color" }) {
  const isHover = styleState({ v, state });

  const { hex: colorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `${prefix}Hex`, device, state }),
    defaultValueValue({ v, key: `${prefix}Palette`, device, state })
  );

  const colorOpacity = defaultValueValue({
    v,
    key: `${prefix}Opacity`,
    device,
    state
  });

  const { hex: hoverColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `${prefix}Hex`, device, state: "hover" }),
    defaultValueValue({ v, key: `${prefix}Palette`, device, state: "hover" })
  );

  const hoverColorOpacity = defaultValueValue({
    v,
    device,
    key: `${prefix}Opacity`,
    state: "hover"
  });

  return isHover === "hover"
    ? hexToRgba(hoverColorHex, hoverColorOpacity)
    : hexToRgba(colorHex, colorOpacity);
}
