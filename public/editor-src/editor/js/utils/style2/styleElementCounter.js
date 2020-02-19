import { styleColor } from "visual/utils/style2";

export function styleElementCounterStrokeColor({
  v,
  device,
  state,
  prefix = "strokeColor"
}) {
  return styleColor({ v, device, state, prefix });
}

export function styleElementCounterFillColor({
  v,
  device,
  state,
  prefix = "fillColor"
}) {
  return styleColor({ v, device, state, prefix });
}
