import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function styleBorderStyle({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("borderStyle");
}

export function styleBorderColor({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
  );

  return hexToRgba(hex, dvv("borderColorOpacity"));
}

export function styleBorderWidthType({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("borderWidthType");
}

export function styleBorderWidthGrouped({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("borderWidth");
}

export function styleBorderWidthUngrouped({ v, device, state, current }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(current);
}

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;
