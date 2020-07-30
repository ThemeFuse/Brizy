import { defaultValueValue } from "visual/utils/onChange";

export function styleAnimationName({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  return dvv("animationName");
}

export function styleAnimationDuration({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  return dvv("animationDuration");
}

export function styleAnimationDelay({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  return dvv("animationDelay");
}
