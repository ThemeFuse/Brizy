import { defaultValueValue } from "visual/utils/onChange";

export function styleElementTableWidth({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("width");
}

export function styleElementTableIconPosition({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("iconPosition");
}

export function styleElementTableIconSpacing({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("iconSpacing");
}

export function styleElementTableColumns({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("columns");
}

export function styleElementTableAside({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("tableAside");
}

export function styleElementTableWidthType({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("widthType");
}

export function styleElementTableAsideWidth({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("asideWidth");
}
