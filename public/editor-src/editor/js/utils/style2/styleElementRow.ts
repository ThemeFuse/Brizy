import { defaultValueValue } from "visual/utils/onChange";
import type { CSSValue } from "visual/utils/style2/types";
import type { MValue } from "visual/utils/value";

type MString = MValue<string>;

export function styleReverseColumnsRow({ v, device }: CSSValue): MString {
  return defaultValueValue({ v, key: "reverseColumns", device });
}

export function styleElementRowMedia({ v, device }: CSSValue): MString {
  return defaultValueValue({ v, key: "media", device });
}
