import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function styleBoxShadowType({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("boxShadow");
}

export function styleBoxShadowColor({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  const { hex } = getOptionColorHexByPalette(
    dvv("boxShadowColorHex"),
    dvv("boxShadowColorPalette")
  );

  return hexToRgba(hex, dvv("boxShadowColorOpacity"));
}

export function styleBoxShadowHorizontal({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("boxShadowHorizontal");
}

export function styleBoxShadowVertical({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("boxShadowVertical");
}

export function styleBoxShadowBlur({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("boxShadowBlur");
}

export function styleBoxShadowSpread({ v, device, state }) {
  state = getState(v, state);

  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("boxShadowSpread");
}

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;
