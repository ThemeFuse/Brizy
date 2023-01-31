import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";

export function getRowsNr({ v, device, state }: CSSValue): number {
  return defaultValueValue({ v, key: "gridRowsNr", device, state });
}

export function getHorizontalGap({ v, device, state }: CSSValue): number {
  return defaultValueValue({ v, key: "gridHorizontalGap", device, state });
}

export function getVerticalGap({ v, device, state }: CSSValue): number {
  return defaultValueValue({ v, key: "gridVerticalGap", device, state });
}
