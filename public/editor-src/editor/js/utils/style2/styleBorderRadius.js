import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { capByPrefix } from "visual/utils/string";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleBorderRadiusType({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });
  const borderRadius = capByPrefix(prefix, "borderRadius");

  return dvv(capByPrefix(borderRadius, "type"));
}

export function styleBorderRadiusGrouped({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "borderRadius"));
}

export function styleBorderRadiusUngrouped({
  v,
  device,
  state,
  prefix = "",
  current = "topLeft"
}) {
  state = getState(v, state);

  const border = capByPrefix(prefix, "border");
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(border, `${current}Radius`));
}
