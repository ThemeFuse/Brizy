import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleColor({ v, device, state, getConfig, prefix = "color" }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const palette = dvv(capByPrefix(prefix, "palette"));
  const hex = dvv(capByPrefix(prefix, "hex"));
  const opacity = dvv(capByPrefix(prefix, "opacity"));

  return getColor(palette, hex, opacity, config);
}
