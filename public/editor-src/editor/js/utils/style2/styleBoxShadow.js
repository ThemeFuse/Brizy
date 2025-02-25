import { configSelector } from "visual/redux/selectors";
import { getColor } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";

const getState = (v, state) =>
  styleState({ v, state }) === "hover" ? "hover" : state;

export function styleBoxShadowType({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "boxShadow"));
}

export function styleBoxShadowColor({ v, device, state, store, prefix = "" }) {
  state = getState(v, state);

  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());

  const boxShadow = capByPrefix(prefix, "boxShadow");
  const colorHex = dvv(capByPrefix(boxShadow, "colorHex"));
  const colorOpacity = dvv(capByPrefix(boxShadow, "colorOpacity"));
  const colorPalette = dvv(capByPrefix(boxShadow, "colorPalette"));

  return getColor(colorPalette, colorHex, colorOpacity, config);
}

export function styleBoxShadowHorizontal({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const boxShadow = capByPrefix(prefix, "boxShadow");
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(boxShadow, "horizontal"));
}

export function styleBoxShadowVertical({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const boxShadow = capByPrefix(prefix, "boxShadow");
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(boxShadow, "vertical"));
}

export function styleBoxShadowBlur({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const boxShadow = capByPrefix(prefix, "boxShadow");
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(boxShadow, "blur"));
}

export function styleBoxShadowSpread({ v, device, state, prefix = "" }) {
  state = getState(v, state);

  const boxShadow = capByPrefix(prefix, "boxShadow");
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(boxShadow, "spread"));
}
