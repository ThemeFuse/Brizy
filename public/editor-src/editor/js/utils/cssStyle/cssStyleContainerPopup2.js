import {
  styleContainerPopup2ContainerWidth,
  styleContainerPopup2ContainerWidthSuffix,
  styleContainerPopup2CloseState,
  styleContainerPopup2CloseAlign,
  styleContainerPopup2ClosePosition,
  styleContainerPopup2CloseHorizontalPosition,
  styleContainerPopup2CloseHorizontalPositionSuffix,
  styleContainerPopup2CloseVerticalPosition,
  styleContainerPopup2CloseVerticalPositionSuffix,
  styleContainerPopup2CloseCustomSize,
  styleContainerPopup2CloseBgSize,
  styleContainerPopup2CloseBorderRadius,
  styleColor,
  styleBgColor,
  styleAlignFlexVerticalAlign
} from "visual/utils/style2";

export function cssStyleContainerPopup2ContainerWidth({ v, device, state }) {
  const maxWidth = styleContainerPopup2ContainerWidth({ v, device, state });
  const maxWidthSuffix = styleContainerPopup2ContainerWidthSuffix({
    v,
    device,
    state
  });

  return maxWidth === undefined ? "" : `width:${maxWidth}${maxWidthSuffix};`;
}

export function cssStyleContainerPopup2CloseState({ v, device, state }) {
  const closeState = styleContainerPopup2CloseState({ v, device, state });

  return closeState === undefined ? "" : `display:${closeState};`;
}

export function cssStyleContainerPopup2CloseColor({ v, device, state }) {
  const closeColor = styleColor({
    v,
    device,
    state,
    prefix: "closeColor"
  });

  return closeColor === undefined ? "" : `color:${closeColor};`;
}

export function cssStyleContainerPopup2CloseFontSize({ v, device, state }) {
  const customSize = styleContainerPopup2CloseCustomSize({ v, device, state });
  const closeBgSize = styleContainerPopup2CloseBgSize({ v, device, state });

  return customSize === undefined || closeBgSize === undefined
    ? ""
    : `font-size:${customSize + closeBgSize * 2}px;`;
}

export function cssStyleContainerPopup2CloseBgSize({ v, device, state }) {
  const closeBgSize = styleContainerPopup2CloseBgSize({ v, device, state });

  return closeBgSize === undefined ? "" : `padding:${closeBgSize}px;`;
}

export function cssStyleContainerPopup2CloseBorderRadius({ v, device, state }) {
  const borderRadius = styleContainerPopup2CloseBorderRadius({
    v,
    device,
    state
  });

  return borderRadius === undefined ? "" : `border-radius:${borderRadius}px;`;
}

export function cssStyleContainerPopup2CloseBgColor({ v, device, state }) {
  const closeBgColor = styleBgColor({
    v,
    device,
    prefix: "closeBg",
    state
  });
  return closeBgColor === undefined ? "" : `background-color:${closeBgColor};`;
}

export function cssStyleContainerPopup2ClosePosition({ v, device, state }) {
  const closeAlign = styleContainerPopup2CloseAlign({
    v,
    device,
    state
  });
  const closeHorizontalPosition = styleContainerPopup2CloseHorizontalPosition({
    v,
    device,
    state
  });
  const closeHorizontalPositionSuffix = styleContainerPopup2CloseHorizontalPositionSuffix(
    {
      v,
      device,
      state
    }
  );
  const closeVerticalPosition = styleContainerPopup2CloseVerticalPosition({
    v,
    device,
    state
  });
  const closeVerticalPositionSuffix = styleContainerPopup2CloseVerticalPositionSuffix(
    {
      v,
      device,
      state
    }
  );
  const closeCustomSize = styleContainerPopup2CloseCustomSize({
    v,
    device,
    state
  });
  const closeCloseBgSize = styleContainerPopup2CloseBgSize({
    v,
    device,
    state
  });
  const closePosition = styleContainerPopup2ClosePosition({ v, device, state });

  const vertical = `${
    closePosition === "outside"
      ? -closeVerticalPosition - closeCustomSize - closeCloseBgSize * 2
      : closeVerticalPosition
  }${closeVerticalPositionSuffix}`;

  const horizontal = `${
    closePosition === "outside"
      ? -closeHorizontalPosition - closeCustomSize - closeCloseBgSize * 2
      : closeHorizontalPosition
  }${closeHorizontalPositionSuffix}`;

  switch (closeAlign) {
    case "topLeft": {
      return `top:${vertical};left:${horizontal};right:auto;bottom:auto;`;
    }
    case "topRight": {
      return `top:${vertical};right:${horizontal};left:auto;bottom:auto;`;
    }
    case "bottomLeft": {
      return `bottom:${vertical};left:${horizontal};right:auto;top:auto;`;
    }
    case "bottomRight": {
      return `bottom:${vertical};right:${horizontal};left:auto;top:auto;`;
    }
  }
}

export function cssStyleContainerPopup2RowFlexVerticalAlign({
  v,
  device,
  state
}) {
  const alignItems = styleAlignFlexVerticalAlign({
    v,
    device,
    state,
    prefix: "popupRow"
  });

  return alignItems === undefined ? "" : `align-items:${alignItems};`;
}
