import * as Num from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange";
import type { CSSValue } from "visual/utils/style2/types";
import type { MValue } from "visual/utils/value";

export function styleZIndex(d: CSSValue): MValue<number> {
  const dvv = (key: string): unknown => defaultValueValue({ key, ...d });

  return Num.read(dvv("zIndex"));
}
