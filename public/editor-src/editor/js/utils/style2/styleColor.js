import { capByPrefix } from "visual/utils/string";
import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { styleState } from "visual/utils/style";
import { getOptionColorHexByPalette } from "visual/utils/options";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleColor({ v, device, state, prefix = "color" }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv(capByPrefix(prefix, "hex")),
    dvv(capByPrefix(prefix, "palette"))
  );
  return hexToRgba(hex, dvv(capByPrefix(prefix, "opacity")));
}
