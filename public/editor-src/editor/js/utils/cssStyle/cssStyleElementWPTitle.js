import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { capByPrefix } from "../string";
import { styleState } from "visual/utils/style";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function cssStyleElementTitleTextShadow({
  v,
  device,
  state,
  prefix = "text"
}) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv(capByPrefix(prefix, "shadowColorHex")),
    dvv(capByPrefix(prefix, "shadowColorPalette"))
  );

  const color = hexToRgba(hex, dvv(capByPrefix(prefix, "shadowColorOpacity")));
  const blur = dvv(capByPrefix(prefix, "shadowBlur"));
  const horizontal = dvv(capByPrefix(prefix, "shadowHorizontal"));
  const vertical = dvv(capByPrefix(prefix, "shadowVertical"));

  return `text-shadow:${horizontal}px ${vertical}px ${blur}px ${color};`;
}
