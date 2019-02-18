import { defaultValueValue } from "visual/utils/onChange";

export function styleElementLineBorderWidth({ v, device }) {
  return `${defaultValueValue({ v, key: "borderWidth", device })}px`;
}
