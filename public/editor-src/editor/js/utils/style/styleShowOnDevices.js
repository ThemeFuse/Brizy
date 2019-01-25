export function styleShowOnDesktopFilter({ v }) {
  const { showOnDesktop } = v;

  return showOnDesktop == "on" ? "none" : "blur(3px)";
}

export function styleShowOnDesktopOpacity({ v }) {
  const { showOnDesktop } = v;

  return showOnDesktop == "on" ? 1 : 0.9;
}

export function styleShowOnTabletFilter({ v }) {
  const { showOnTablet } = v;

  return showOnTablet == "on" ? "none" : "blur(3px)";
}

export function styleShowOnTabletOpacity({ v }) {
  const { showOnTablet } = v;

  return showOnTablet == "on" ? 1 : 0.9;
}

export function styleShowOnMobileFilter({ v }) {
  const { showOnMobile } = v;

  return showOnMobile == "on" ? "none" : "blur(3px)";
}

export function styleShowOnMobileOpacity({ v }) {
  const { showOnMobile } = v;

  return showOnMobile == "on" ? 1 : 0.9;
}
