import { configSelector } from "visual/redux/selectors";
import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleBorderStyle({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");

  return dvv(capByPrefix(border, "style"));
}

export function styleBorderColor({ v, device, state, store, prefix = "" }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const border = capByPrefix(prefix, "border");

  const colorHex = dvv(capByPrefix(border, "colorHex"));
  const colorOpacity = dvv(capByPrefix(border, "colorOpacity"));
  const colorPalette = dvv(capByPrefix(border, "colorPalette"));

  return getColor(colorPalette, colorHex, colorOpacity, config);
}

export function styleBorderWidthType({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");

  return dvv(capByPrefix(border, "widthType"));
}

export function styleBorderWidthGrouped({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");

  return dvv(capByPrefix(border, "width"));
}

export function styleBorderWidthUngrouped({
  v,
  device,
  state,
  prefix = "",
  current = "top"
}) {
  state = getState(v, state);

  const border = capByPrefix(prefix, "border");
  const currentWidth = capByPrefix(border, `${current}Width`);
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(currentWidth);
}
