import { defaultValueValue } from "visual/utils/onChange";
import * as Str from "visual/utils/reader/string";
import { capByPrefix } from "visual/utils/string";
import type { MValue } from "visual/utils/value";
import type { CSSValue } from "../style2/types";

type Get = (k: string) => MValue<unknown>;
type MString = MValue<string>;

export function styleAlignFlexVerticalAlign({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MString {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return Str.read(dvv(capByPrefix(prefix, "verticalAlign")));
}

export function styleAlignHorizontal({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MString {
  const dvv: Get = (key) => defaultValueValue({ v, key, device, state });

  return Str.read(dvv(capByPrefix(prefix, "horizontalAlign")));
}
