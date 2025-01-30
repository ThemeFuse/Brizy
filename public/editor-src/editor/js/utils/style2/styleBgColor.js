import { configSelector } from "visual/redux/selectors";
import { getColor, getColorPalette } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleBgColor({ v, device, state, store, prefix = "bg" }) {
  state = getState(v, state);
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());

  const palette = dvv(capByPrefix(prefix, "colorPalette"));
  const hex = dvv(capByPrefix(prefix, "colorHex"));
  const opacity = dvv(capByPrefix(prefix, "colorOpacity"));

  return getColor(palette, hex, opacity, config);
}

export function styleBgColorHex({ v, device, state, store, prefix = "bg" }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());
  const colorPalette = dvv(capByPrefix(prefix, "colorPalette"));
  const colorHex = dvv(capByPrefix(prefix, "colorHex"));

  return getColorPalette(colorPalette, colorHex, config);
}
