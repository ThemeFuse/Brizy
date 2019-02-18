import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { styleState } from "visual/utils/style";

export function styleColor({ v, state }) {
  const isHover = styleState({ v, state });
  const colorHex = defaultValueValue({ v, key: "colorHex", state });
  const colorOpacity = defaultValueValue({ v, key: "colorOpacity", state });
  const hoverColorHex = defaultValueValue({
    v,
    key: "colorHex",
    state: "hover"
  });
  const hoverColorOpacity = defaultValueValue({
    v,
    key: "colorOpacity",
    state: "hover"
  });

  return isHover === "hover"
    ? hexToRgba(hoverColorHex, hoverColorOpacity)
    : hexToRgba(colorHex, colorOpacity);
}
