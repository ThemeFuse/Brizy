import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";

export function styleBorderRadius({ v, device, state, current }) {
  const isHover = styleState({ v, state });
  const borderRadiusType = defaultValueValue({
    v,
    key: "borderRadiusType",
    device,
    state
  });
  const hoverBorderRadiusType = defaultValueValue({
    v,
    key: "borderRadiusType",
    device,
    state: "hover"
  });
  const borderRadius = defaultValueValue({
    v,
    key: "borderRadius",
    device,
    state
  });
  const hoverBorderRadius = defaultValueValue({
    v,
    key: "borderRadius",
    device,
    state: "hover"
  });
  const currentValue = defaultValueValue({ v, key: current, device, state });
  const hoverCurrentValue = defaultValueValue({
    v,
    key: current,
    device,
    state: "hover"
  });

  return isHover === "hover" && hoverBorderRadiusType === "grouped"
    ? `${hoverBorderRadius}px`
    : isHover === "hover" && hoverBorderRadiusType === "ungrouped"
    ? `${hoverCurrentValue}px`
    : borderRadiusType === "grouped"
    ? `${borderRadius}px`
    : `${currentValue}px`;
}
