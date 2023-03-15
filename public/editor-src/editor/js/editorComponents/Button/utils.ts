import { isNumber } from "visual/utils/math";
import { read } from "visual/utils/math/number";
import { defaultValueValue } from "visual/utils/onChange/device";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";

export const hasSizing = (
  v: Record<string, unknown>,
  device: ResponsiveMode,
  state: State
): boolean =>
  ["width", "height"]
    .map((key) => defaultValueValue({ v, key, device, state }))
    .map(read)
    .every(isNumber);
