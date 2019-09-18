import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";

export function styleBorderRadiusType({ v, device, state }) {
  const isHover = styleState({ v, state });

  const currentValue = defaultValueValue({
    v,
    key: "borderRadiusType",
    device,
    state
  });

  const hoverCurrentValue = defaultValueValue({
    v,
    key: "borderRadiusType",
    device,
    state: "hover"
  });

  return isHover === "hover" ? hoverCurrentValue : currentValue;
}

export function styleBorderRadiusGrouped({ v, device, state }) {
  const isHover = styleState({ v, state });

  const currentValue = defaultValueValue({
    v,
    key: "borderRadius",
    device,
    state
  });

  const hoverCurrentValue = defaultValueValue({
    v,
    key: "borderRadius",
    device,
    state: "hover"
  });

  return isHover === "hover" ? hoverCurrentValue : currentValue;
}

export function styleBorderRadiusUngrouped({ v, device, state, current }) {
  const isHover = styleState({ v, state });

  const currentValue = defaultValueValue({ v, key: current, device, state });

  const hoverCurrentValue = defaultValueValue({
    v,
    key: current,
    device,
    state: "hover"
  });

  return isHover === "hover" ? hoverCurrentValue : currentValue;
}
