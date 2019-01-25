import { defaultValueValue } from "visual/utils/onChange";

export function styleSizeWidth({ v, device }) {
  return `${defaultValueValue({ v, key: "width", device })}%`;
}
