import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { capByPrefix } from "../string";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function cssStyleElementTitleTextShadow({
  v,
  device,
  state,
  getConfig,
  prefix = "text"
}) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const colorHex = dvv(capByPrefix(prefix, "shadowColorHex"));
  const colorPalette = dvv(capByPrefix(prefix, "shadowColorPalette"));
  const colorOpacity = dvv(capByPrefix(prefix, "shadowColorOpacity"));
  const color = getColor(colorPalette, colorHex, colorOpacity, config);
  const blur = dvv(capByPrefix(prefix, "shadowBlur"));
  const horizontal = dvv(capByPrefix(prefix, "shadowHorizontal"));
  const vertical = dvv(capByPrefix(prefix, "shadowVertical"));

  return `text-shadow:${horizontal}px ${vertical}px ${blur}px ${color};`;
}
