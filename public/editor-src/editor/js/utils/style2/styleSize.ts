import * as N from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { CSSValue } from "visual/utils/style2/types";
import { MValue } from "visual/utils/value";

type Get = (k: string) => MValue<unknown>;
type MNum = MValue<number>;

export function styleSizeWidth({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MNum {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return N.read(dvv(capByPrefix(prefix, "width")));
}

export function styleSizeHeight({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MNum {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return N.read(dvv(capByPrefix(prefix, "height")));
}

export function styleSizeSize({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MNum {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return N.read(dvv(capByPrefix(prefix, "size")));
}

export function styleSizeContainerSize({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MNum {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return N.read(dvv(capByPrefix(prefix, "containerSize")));
}

export function styleSizeTextSpacing({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MNum {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return N.read(dvv(capByPrefix(prefix, "textSpacing")));
}

export function styleSizeSpacing({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MNum {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return N.read(dvv(capByPrefix(prefix, "spacing")));
}

export function styleSizeCustom({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MNum {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return N.read(dvv(capByPrefix(prefix, "customSize")));
}

export function styleSizeHeaderWidth({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MNum {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return N.read(dvv(capByPrefix(prefix, "headerWidth")));
}
