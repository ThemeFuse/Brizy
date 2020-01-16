import { defaultValueValue } from "visual/utils/onChange";

export function styleContainerPopup2ContainerWidth({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("width");
}

export function styleContainerPopup2ContainerWidthSuffix({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("widthSuffix");
}

export function styleContainerPopup2CloseState({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("showCloseButton") === "on" ? "block" : "none";
}

export function styleContainerPopup2CloseHorizontalPosition({
  v,
  device,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("closeHorizontalPosition");
}

export function styleContainerPopup2CloseHorizontalPositionSuffix({
  v,
  device,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("closeHorizontalPositionSuffix");
}

export function styleContainerPopup2CloseVerticalPosition({
  v,
  device,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("closeVerticalPosition");
}

export function styleContainerPopup2CloseVerticalPositionSuffix({
  v,
  device,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("closeVerticalPositionSuffix");
}

export function styleContainerPopup2CloseCustomSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("closeCustomSize");
}

export function styleContainerPopup2CloseBgSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("closeBgSize");
}

export function styleContainerPopup2CloseBorderRadius({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("closeBorderRadius");
}

export function styleContainerPopup2CloseAlign({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("closeAlign");
}

export function styleContainerPopup2ClosePosition({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("closePosition");
}

export function styleContainerPopup2CustomHeightStyle({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("columnsHeightStyle");
}

export function styleContainerPopup2ColumnsHeight({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("columnsHeight");
}

export function styleContainerPopup2ColumnsHeightSuffix({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("columnsHeightSuffix");
}
