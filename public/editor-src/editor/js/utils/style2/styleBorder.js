import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { capByPrefix } from "visual/utils/string";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleBorderStyle({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");

  return dvv(capByPrefix(border, "style"));
}

export function styleBorderColor({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");
  const colorHex = capByPrefix(border, "colorHex");
  const colorOpacity = capByPrefix(border, "colorOpacity");
  const colorPalette = capByPrefix(border, "colorPalette");
  const { hex } = getOptionColorHexByPalette(dvv(colorHex), dvv(colorPalette));

  return hexToRgba(hex, dvv(colorOpacity));
}

export function styleBorderWidthType({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });
  const border = capByPrefix(prefix, "border");

  return dvv(capByPrefix(border, "widthType"));
}

export function styleBorderWidthGrouped({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });
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
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(currentWidth);
}
