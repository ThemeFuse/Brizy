import { capByPrefix } from "visual/utils/string";
import { defaultValueValue } from "visual/utils/onChange";
import { getColor } from "visual/utils/color";
import { styleState } from "visual/utils/style";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleColor({ v, device, state, prefix = "color" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  const palette = dvv(capByPrefix(prefix, "palette"));
  const hex = dvv(capByPrefix(prefix, "hex"));
  const opacity = dvv(capByPrefix(prefix, "opacity"));

  return getColor(palette, hex, opacity);
}
