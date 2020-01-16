import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function styleSizeWidth({ v, device, state, prefix = "" }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "width"));
}

export function styleSizeHeight({ v, device }) {
  return defaultValueValue({ v, key: "height", device });
}

export function styleSizeSize({ v, device }) {
  return defaultValueValue({ v, key: "size", device });
}

export function styleSizeContainerSize({ v, device, state }) {
  return defaultValueValue({ v, key: "containerSize", device, state });
}

export function styleSizeTextSpacing({ v, device, state }) {
  return `${defaultValueValue({ v, key: "textSpacing", device, state })}`;
}

export function styleSizeSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("spacing");
}
