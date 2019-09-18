export function styleDisplayShowOnDesktop({ v }) {
  const { showOnDesktop } = v;

  return showOnDesktop === "off" ? "none" : "";
}

export function styleDisplayShowOnTablet({ v }) {
  const { showOnTablet } = v;

  return showOnTablet === "off" ? "none" : "";
}

export function styleDisplayShowOnMobile({ v }) {
  const { showOnMobile } = v;

  return showOnMobile === "off" ? "none" : "";
}
