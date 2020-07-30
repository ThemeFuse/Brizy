import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { CSSValue } from "visual/utils/style2/types";
import { MValue } from "visual/utils/value";
import * as N from "visual/utils/math/number";

type Get = (k: string) => MValue<unknown>;
type MNum = MValue<number>;

export function styleSizeWidth({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): MNum {
  const dvv: Get = key => defaultValueValue({ v, key, device, state });

  return N.read(dvv(capByPrefix(prefix, "width")));
}

export function styleSizeHeight({ v, device }: CSSValue): MNum {
  return N.read(defaultValueValue({ v, key: "height", device }));
}

export function styleSizeSize({ v, device }: CSSValue): MNum {
  return N.read(defaultValueValue({ v, key: "size", device }));
}

export function styleSizeContainerSize({ v, device, state }: CSSValue): MNum {
  return N.read(defaultValueValue({ v, key: "containerSize", device, state }));
}

export function styleSizeTextSpacing({ v, device, state }: CSSValue): MNum {
  return N.read(defaultValueValue({ v, key: "textSpacing", device, state }));
}

export function styleSizeSpacing({ v, device, state }: CSSValue): MNum {
  const dvv: Get = key => defaultValueValue({ v, key, device, state });

  return N.read(dvv("spacing"));
}
