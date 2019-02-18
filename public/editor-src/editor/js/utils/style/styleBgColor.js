import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { styleState } from "visual/utils/style";

export function styleBgColor({ v, device, state }) {
  const isHover = styleState({ v, state });
  const bgColorType = defaultValueValue({
    v,
    key: "bgColorType",
    device,
    state
  });
  const bgColorHex = defaultValueValue({ v, key: "bgColorHex", device, state });
  const bgColorOpacity = defaultValueValue({
    v,
    key: "bgColorOpacity",
    device,
    state
  });
  const hoverBgColorType = defaultValueValue({
    v,
    key: "bgColorType",
    device,
    state: "hover"
  });
  const hoverBgColorHex = defaultValueValue({
    v,
    key: "bgColorHex",
    device,
    state: "hover"
  });
  const hoverBgColorOpacity = defaultValueValue({
    v,
    key: "bgColorOpacity",
    device,
    state: "hover"
  });

  return isHover === "hover" && hoverBgColorType === "solid"
    ? hexToRgba(hoverBgColorHex, hoverBgColorOpacity)
    : bgColorType === "solid"
    ? hexToRgba(bgColorHex, bgColorOpacity)
    : "transparent";
}
