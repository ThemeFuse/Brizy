import { capByPrefix } from "visual/utils/string";
import { defaultValueValue } from "visual/utils/onChange";
import { getColor } from "visual/utils/color";
import { styleState } from "visual/utils/style";
import { getOptionColorHexByPalette } from "visual/utils/options";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleBgColor({ v, device, state, prefix = "bg" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  const palette = dvv(capByPrefix(prefix, "colorPalette"));
  const hex = dvv(capByPrefix(prefix, "colorHex"));
  const opacity = dvv(capByPrefix(prefix, "colorOpacity"));

  return getColor(palette, hex, opacity);
}

export function styleBgColorHex({ v, device, state, prefix = "bg" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return getOptionColorHexByPalette(
    dvv(capByPrefix(prefix, "colorHex")),
    dvv(capByPrefix(prefix, "colorPalette"))
  ).hex;
}
