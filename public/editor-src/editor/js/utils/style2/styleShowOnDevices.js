export function styleShowOnEditorFilter({ v, device, state }) {
  let showOn;

  if (IS_EDITOR) {
    if (device === "desktop") {
      showOn = styleShowOnDesktopFilter({ v, device, state });
    } else if (device === "tablet") {
      showOn = styleShowOnTabletFilter({ v, device, state });
    } else {
      showOn = styleShowOnMobileFilter({ v, device, state });
    }
  }

  return showOn;
}

export function styleShowOnEditorOpacity({ v, device, state }) {
  let showOn;

  if (IS_EDITOR) {
    if (device === "desktop") {
      showOn = styleShowOnDesktopOpacity({ v, device, state });
    } else if (device === "tablet") {
      showOn = styleShowOnTabletOpacity({ v, device, state });
    } else {
      showOn = styleShowOnMobileOpacity({ v, device, state });
    }
  }

  return showOn;
}

export function styleShowOnPreview({ v, device, state }) {
  let showOn;

  if (IS_PREVIEW) {
    if (device === "desktop") {
      showOn = styleDisplayShowOnDesktop({ v, device, state });
    } else if (device === "tablet") {
      showOn = styleDisplayShowOnTablet({ v, device, state });
    } else {
      showOn = styleDisplayShowOnMobile({ v, device, state });
    }
  }

  return showOn;
}

// Editor
function styleShowOnDesktopFilter({ v }) {
  const showOnDesktop = v.showOnDesktop;

  return showOnDesktop === "on" || showOnDesktop === undefined
    ? ""
    : "blur(3px)";
}

function styleShowOnDesktopOpacity({ v }) {
  const showOnDesktop = v.showOnDesktop;

  return showOnDesktop === "on" || showOnDesktop === undefined ? 1 : 0.9;
}

function styleShowOnTabletFilter({ v }) {
  const showOnTablet = v.showOnTablet;

  return showOnTablet === "on" || showOnTablet === undefined ? "" : "blur(3px)";
}

function styleShowOnTabletOpacity({ v }) {
  const showOnTablet = v.showOnTablet;

  return showOnTablet === "on" || showOnTablet === undefined ? 1 : 0.9;
}

function styleShowOnMobileFilter({ v }) {
  const showOnMobile = v.showOnMobile;

  return showOnMobile === "on" || showOnMobile === undefined ? "" : "blur(3px)";
}

function styleShowOnMobileOpacity({ v }) {
  const showOnMobile = v.showOnMobile;

  return showOnMobile === "on" || showOnMobile === undefined ? 1 : 0.9;
}

// Preview
function styleDisplayShowOnDesktop({ v }) {
  const { showOnDesktop } = v;

  return showOnDesktop === "off" && "none";
}

function styleDisplayShowOnTablet({ v }) {
  const { showOnTablet } = v;

  return showOnTablet === "off" && "none";
}

function styleDisplayShowOnMobile({ v }) {
  const { showOnMobile } = v;

  return showOnMobile === "off" && "none";
}
