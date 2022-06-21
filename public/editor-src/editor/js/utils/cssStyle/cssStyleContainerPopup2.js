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
  styleContainerPopup2CustomHeightStyle,
  styleContainerPopup2ColumnsHeight,
  styleContainerPopup2ColumnsHeightSuffix,
  styleColor,
  styleBgColor,
  styleAlignFlexVerticalAlign
} from "visual/utils/style2";
import { defaultValueValue } from "visual/utils/onChange";

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
  const dvv = key => defaultValueValue({ v, key, device, state });
  const closeSize = dvv("closeSize");
  const closeCustomSize = dvv("closeCustomSize");
  const closeBgSize = dvv("closeBgSize");

  switch (closeSize) {
    case "small":
      return `font-size:${16 + closeBgSize * 2}px;`;
    case "medium":
      return `font-size:${24 + closeBgSize * 2}px;`;
    case "large":
      return `font-size:${32 + closeBgSize * 2}px;`;
    case "custom":
      return `font-size:${closeCustomSize + closeBgSize * 2}px;`;
  }
}

export function cssStyleContainerPopup2CloseBgSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const closeBgSize = dvv("closeBgSize");

  return `padding:${closeBgSize}px;`;
}

export function cssStyleContainerPopup2CloseBorderRadius({ v, device, state }) {
  const closeBorderRadius = styleContainerPopup2CloseBorderRadius({
    v,
    device,
    state
  });

  return `border-radius:${closeBorderRadius}px;`;
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

export function cssStyleContainerPopup2CustomHeight({ v, device, state }) {
  const columnSizeStyle = styleContainerPopup2CustomHeightStyle({
    v,
    device,
    state
  });

  const columnsHeight = styleContainerPopup2ColumnsHeight({
    v,
    device,
    state
  });
  const columnsHeightSuffix = styleContainerPopup2ColumnsHeightSuffix({
    v,
    device,
    state
  });
  return columnSizeStyle === "custom2"
    ? `height: ${columnsHeight}${columnsHeightSuffix};`
    : "";
}

export function cssStyleContainerPopup2CustomHeightOverflow({
  v,
  device,
  state
}) {
  const columnSizeStyle = styleContainerPopup2CustomHeightStyle({
    v,
    device,
    state
  });

  return columnSizeStyle === "custom2"
    ? "max-height: 100%; overflow-x: hidden; overflow-y: auto;"
    : "";
}

export function cssStyleContainerPopup2Custom2Height100({ v, device, state }) {
  const columnSizeStyle = styleContainerPopup2CustomHeightStyle({
    v,
    device,
    state
  });
  return columnSizeStyle === "custom2" ? "height: 100%;" : "";
}

export function cssStyleContainerPopup2Custom2MaxHeight100({
  v,
  device,
  state
}) {
  const columnSizeStyle = styleContainerPopup2CustomHeightStyle({
    v,
    device,
    state
  });
  return columnSizeStyle === "custom2" ? "max-height: 100%;" : "";
}
