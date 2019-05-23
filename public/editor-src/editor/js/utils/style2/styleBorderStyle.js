import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";

export function styleBorderStyle({ v, device, state }) {
  const isHover = styleState({ v, state });

  const borderStyle = defaultValueValue({
    v,
    key: "borderStyle",
    device,
    state
  });

  return isHover === "hover" &&
    v.hoverBorderStyle !== undefined &&
    v.hoverBorderStyle !== null
    ? v.hoverBorderStyle === ""
      ? "none"
      : v.hoverBorderStyle
    : borderStyle === ""
    ? "none"
    : borderStyle;
}
