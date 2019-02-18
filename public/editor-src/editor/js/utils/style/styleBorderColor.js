import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { styleState } from "visual/utils/style";

export function styleBorderColor({ v, device, state }) {
  const isHover = styleState({ v, state });
  const borderColorHex = defaultValueValue({
    v,
    key: "borderColorHex",
    device,
    state
  });
  const borderColorOpacity = defaultValueValue({
    v,
    key: "borderColorOpacity",
    device,
    state
  });
  const hoverBorderColorHex = defaultValueValue({
    v,
    key: "borderColorHex",
    device,
    state: "hover"
  });
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
