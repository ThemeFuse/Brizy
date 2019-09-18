import { defaultValueValue } from "visual/utils/onChange";

export function styleSizeWidthPercent({ v, device }) {
  return `${defaultValueValue({ v, key: "width", device })}%`;
}

export function styleSizeHeightPx({ v, device }) {
  return `${defaultValueValue({ v, key: "height", device })}px`;
}

export function styleSizeSizePercent({ v, device }) {
  return `${defaultValueValue({ v, key: "size", device })}%`;
}

export function styleSizeContainerSizePercent({ v }) {
  const { containerSize } = v;

  return `${containerSize}%`;
}
