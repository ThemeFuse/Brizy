import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";

export function styleBorderWidth({ v, device, state, current }) {
  const isHover = styleState({ v, state });
  const borderWidthType = defaultValueValue({
    v,
    key: "borderWidthType",
    device,
    state
  });
  const hoverBorderWidthType = defaultValueValue({
    v,
    key: "borderWidthType",
    device,
    state: "hover"
  });
  const borderWidth = defaultValueValue({
    v,
    key: "borderWidth",
    device,
    state
  });
  const hoverBorderWidth = defaultValueValue({
    v,
    key: "borderWidth",
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

  return isHover === "hover" && hoverBorderWidthType === "grouped"
    ? `${hoverBorderWidth}px`
    : isHover === "hover" && hoverBorderWidthType === "ungrouped"
    ? `${hoverCurrentValue}px`
    : borderWidthType === "grouped"
    ? `${borderWidth}px`
    : `${currentValue}px`;
}
