import { getColor, getColorPalette } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleBgColor({ v, device, state, getConfig, prefix = "bg" }) {
  state = getState(v, state);
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const palette = dvv(capByPrefix(prefix, "colorPalette"));
  const hex = dvv(capByPrefix(prefix, "colorHex"));
  const opacity = dvv(capByPrefix(prefix, "colorOpacity"));

  return getColor(palette, hex, opacity, config);
}

export function styleBgColorHex({
  v,
  device,
  state,
  getConfig,
  prefix = "bg"
}) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = getConfig();
  const colorPalette = dvv(capByPrefix(prefix, "colorPalette"));
  const colorHex = dvv(capByPrefix(prefix, "colorHex"));
  const colorOpacity = dvv(capByPrefix(prefix, "colorOpacity"));

  return getColorPalette(colorPalette, colorHex, colorOpacity, config);
}
