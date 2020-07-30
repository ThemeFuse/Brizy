import { defaultValueValue } from "visual/utils/onChange";

export function styleElementWOORatingSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("ratingSize");
}
