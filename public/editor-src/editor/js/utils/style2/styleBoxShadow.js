import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { capByPrefix } from "visual/utils/string";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleBoxShadowType({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "boxShadow"));
}

export function styleBoxShadowColor({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });
  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorHex = capByPrefix(boxShadow, "colorHex");
  const colorOpacity = capByPrefix(boxShadow, "colorOpacity");
  const colorPalette = capByPrefix(boxShadow, "colorPalette");
  const { hex } = getOptionColorHexByPalette(dvv(colorHex), dvv(colorPalette));

  return hexToRgba(hex, dvv(colorOpacity));
}

export function styleBoxShadowHorizontal({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const boxShadow = capByPrefix(prefix, "boxShadow");
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(boxShadow, "horizontal"));
}

export function styleBoxShadowVertical({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const boxShadow = capByPrefix(prefix, "boxShadow");
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(boxShadow, "vertical"));
}

export function styleBoxShadowBlur({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const boxShadow = capByPrefix(prefix, "boxShadow");
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(boxShadow, "blur"));
}

export function styleBoxShadowSpread({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const boxShadow = capByPrefix(prefix, "boxShadow");
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(boxShadow, "spread"));
}
