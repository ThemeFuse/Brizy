import {
  styleBorderColor,
  styleBorderRadiusGrouped,
  styleBorderWidthGrouped,
  styleElementTimelineEnableText,
  styleElementTimelineIconCustomSize,
  styleElementTimelineIconPadding,
  styleElementTimelineOrientation,
  styleElementTimelineSpacing,
  styleElementTimelineStyle,
  styleElementTimelineTabsCount,
  styleElementTimelineWidth,
  styleElementTimelineWidthSuffix,
  styleTypography2FontSize,
  styleTypography2LineHeight
} from "visual/utils/style2";
import { defaultValueValue } from "visual/utils/onChange";

function cssStyleElementTimelineIconHeightWidth({ v, device, prefix }) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  const customSize = styleElementTimelineIconCustomSize({ v, device, prefix });
  const iconPadding = styleElementTimelineIconPadding({ v, device, prefix });
  return customSize + iconPadding * 2 + borderWidth * 2;
}

function cssStyleElementTimelineIconHalfHeightWidth({
  v,
  device,
  state,
  prefix
}) {
  const fullSize = cssStyleElementTimelineIconHeightWidth({
    v,
    device,
    state,
    prefix
  });
  return fullSize / 2;
}

function cssStyleElementTimelineEnableText({ v, device, prefix }) {
  const enableText = styleElementTimelineEnableText({ v, device, prefix });
  return enableText === "on";
}

function cssStyleElementTimelineTextHeight({ v, device, prefix }) {
  const fontSize = styleTypography2FontSize({
    v,
    device,
    prefix: "typography"
  });
  const lineHeight = styleTypography2LineHeight({
    v,
    device,
    prefix: "typography"
  });
  const enableText = cssStyleElementTimelineEnableText({ v, device, prefix });
  return enableText ? fontSize * lineHeight : 0;
}

function cssStyleElementTimelineTextWidth({ v, device, prefix }) {
  const enableText = cssStyleElementTimelineEnableText({ v, device, prefix });
  return enableText ? 116 : 0;
}

export function cssStyleElementTimelineIconSize({ v, device, prefix }) {
  const customSize = styleElementTimelineIconCustomSize({ v, device, prefix });
  return `font-size: ${customSize}px;`;
}

export function cssStyleElementTimelinePaddingForIcon({ v, device, prefix }) {
  const iconPadding = styleElementTimelineIconPadding({ v, device, prefix });
  return `padding: ${iconPadding}px;`;
}

export function cssStyleElementTimelineIconWidth({ v, prefix }) {
  const iconWidth = cssStyleElementTimelineIconHeightWidth({
    v,
    prefix
  });
  return `width: ${iconWidth}px;`;
}

export function cssStyleElementTimelineIconHeight({ v, prefix }) {
  const iconHeight = cssStyleElementTimelineIconHeightWidth({
    v,
    prefix
  });
  return `height: ${iconHeight}px;`;
}

export function cssStyleElementTimelineNavTitleWidth({ v, prefix }) {
  const iconWidth = cssStyleElementTimelineIconHeightWidth({
    v,
    prefix
  });
  const titleWidth = iconWidth + 60;
  return `width: ${titleWidth}px;`;
}

export function cssStyleElementTimelineNavTitleVisible({ v }) {
  const enableText = cssStyleElementTimelineEnableText({ v });
  return enableText ? "display: block;" : "display: none;";
}

export function cssStyleElementTimelineLineBgColor({ v, device, state }) {
  const borderColor = styleBorderColor({ v, device, prefix: "line" });
  const orientation = styleElementTimelineOrientation({ v, device, state });

  const dvv = key => defaultValueValue({ v, key, device });
  const borderStyle = dvv("lineBorderStyle");
  const borderWidth = dvv("lineBorderWidth");

  return orientation === "off"
    ? `border-top: ${borderColor} ${borderWidth}px ${borderStyle};`
    : `border-left: ${borderColor} ${borderWidth}px ${borderStyle};border-top:0;`;
}

export function cssStyleElementTimelineLineTop({ v, device, state }) {
  const style = styleElementTimelineStyle({ v, device, state });
  const orientation = styleElementTimelineOrientation({ v, device, state });
  const borderWidthLine = styleBorderWidthGrouped({ v, prefix: "line" });
  const halfIconHeight = cssStyleElementTimelineIconHalfHeightWidth({ v });
  const textHeight = cssStyleElementTimelineTextHeight({ v, device });
  const iconHeight = cssStyleElementTimelineIconHalfHeightWidth({
    v
  });
  const borderWidth = styleBorderWidthGrouped({ v, device });
  const customSize = styleElementTimelineIconCustomSize({ v, device });
  const iconPadding = styleElementTimelineIconPadding({ v, device });

  const leftPosition = customSize + iconPadding * 2 + borderWidth * 2 + 20;
  const afterHeight = halfIconHeight + textHeight - borderWidthLine / 2;

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return `top: ${afterHeight}px; bottom:auto; left: ${leftPosition}px;`;
      }
      case "style-2": {
        return `bottom: ${afterHeight}px; top:auto; left: ${leftPosition}px;`;
      }
      case "style-3": {
        return `top: ${afterHeight}px; bottom:auto; left: ${leftPosition}px;`;
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `top: calc( ${iconHeight}px + 50%);`;
      }
      case "style-2": {
        return `top: calc( ${iconHeight}px + 50%);`;
      }
      case "style-3": {
        return `top: calc( ${iconHeight}px + 50%);`;
      }
    }
  }
}

export function cssStyleElementTimelineContentSpacing({ v, device, prefix }) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return `margin: ${spacing}px 10px 0 10px;`;
      }
      case "style-2": {
        return `margin: 0 10px ${spacing}px 10px;`;
      }
      case "style-3": {
        return `margin: ${spacing}px 10px 0 10px;`;
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `margin: 0 0 0 ${spacing}px;`;
      }
      case "style-2": {
        return `margin: 0 ${spacing}px 0 0;`;
      }
      case "style-3": {
        return `margin: 0 0 0 ${spacing}px;`;
      }
    }
  }
}

export function cssStyleElementTimelineArrowBorder({ v, device, prefix }) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  const borderColor = styleBorderColor({ v, device, prefix });
  return `border: ${borderWidth}px solid ${borderColor};`;
}

export function cssStyleElementTimelineIconBorderRadius({
  v,
  device,
  state,
  prefix
}) {
  const borderRadius = styleBorderRadiusGrouped({ v, device, state, prefix });
  return `border-radius: ${borderRadius}px;`;
}

export function cssStyleElementTimelineVerticalPosition({
  v,
  device,
  state,
  prefix
}) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const position = textWidth + halfIconWidth;
  const orientation = styleElementTimelineOrientation({ v, device, state });
  const style = styleElementTimelineStyle({ v, device, state });
  if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `left: calc(50% - ${position}px); right: auto;`;
      }
      case "style-2": {
        return `right: calc(50% - ${position}px); left: auto;`;
      }
    }
  } else if (orientation === "off") {
    return "left: auto; right: auto;";
  }
}

export function cssStyleElementTimelineLineWidthHeightBefore({
  v,
  device,
  state,
  prefix
}) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const iconWidth = cssStyleElementTimelineIconHeightWidth({
    v,
    prefix
  });
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix: "line" });
  const orientation = styleElementTimelineOrientation({ v, device, state });
  if (orientation === "on") {
    return `height: calc(50% - ${halfIconWidth}px); width: ${borderWidth}px;`;
  } else if (orientation === "off") {
    return `width: calc(100% - ${iconWidth}px); height: ${borderWidth}px;`;
  }
}

export function cssStyleElementTimelineLineWidthHeightAfter({
  v,
  device,
  state,
  prefix
}) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const iconWidth = cssStyleElementTimelineIconHeightWidth({
    v,
    prefix
  });
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix: "line" });
  const orientation = styleElementTimelineOrientation({ v, device, state });
  if (orientation === "on") {
    return `height: calc(${100 -
      borderWidth}px + (50% - ${halfIconWidth}px)); width: ${borderWidth}px;`;
  } else if (orientation === "off") {
    return `width: calc(100% - ${iconWidth}px); height: ${borderWidth}px;`;
  }
}

export function cssStyleElementTimelineVerticalLinePosition({
  v,
  device,
  state,
  prefix
}) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix: "line" });
  const iconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const linePosition = textWidth + iconWidth - borderWidth / 2;
  const orientation = styleElementTimelineOrientation({ v, device, state });
  const style = styleElementTimelineStyle({ v, device, state });

  if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `left: ${linePosition}px; bottom: calc( ${iconWidth}px + 50%);`;
      }
      case "style-2": {
        return `right: ${linePosition}px; bottom: calc( ${iconWidth}px + 50%);`;
      }
      case "style-3": {
        return `left: ${linePosition}px; bottom: calc( ${iconWidth}px + 50%);`;
      }
    }
  }
}

export function cssStyleElementTimelineBeforeDisplay({ v, device, state }) {
  const orientation = styleElementTimelineOrientation({ v, device, state });
  if (orientation === "on") {
    return "display: block;";
  } else if (orientation === "off") {
    return "display: none;";
  }
}

export function cssStyleElementTimelineVerticalLineTopPosition({
  v,
  device,
  state,
  prefix
}) {
  const iconHeight = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const orientation = styleElementTimelineOrientation({ v, device, state });
  if (orientation === "on") return `top: calc( ${iconHeight}px + 50%);`;
}

export function cssStyleElementTimelineVerticalLineBottomPosition({
  v,
  device,
  state,
  prefix
}) {
  const iconHeight = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const orientation = styleElementTimelineOrientation({ v, device, state });
  const style = styleElementTimelineStyle({ v, device, state });
  if (
    orientation === "on" &&
    (style === "style-1" || style === "style-2" || style === "style-3")
  )
    return `bottom: calc( ${iconHeight}px + 50%);`;
}

export function cssStyleElementTimelineCustomTabWidth({ v, device, prefix }) {
  const tabsCount = styleElementTimelineTabsCount({ v, device, prefix });
  const orientation = styleElementTimelineOrientation({ v, device, prefix });
  if (orientation === "off") {
    const tabWidth = 100 / tabsCount;
    return `width: ${tabWidth}%;  min-width: ${tabWidth}%;`;
  } else {
    return "width: auto;  min-width: auto;";
  }
}

export function cssStyleElementTimelineCustomLastTabWidth({
  v,
  device,
  prefix
}) {
  const tabsCount = styleElementTimelineTabsCount({ v, device, prefix });
  const tabWidth = 100 / tabsCount;
  return `width: calc(${tabWidth}% - 30px);  min-width: calc(${tabWidth}% - 30px);`;
}

export function cssStyleElementTimelineVerticalInvertPosition({
  v,
  device,
  state,
  prefix
}) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const rightPosition = textWidth + halfIconWidth;
  const orientation = styleElementTimelineOrientation({ v, device, state });
  const style = styleElementTimelineStyle({ v, device, state });
  if (orientation === "on" && style === "style-2")
    return `right: calc(50% - ${rightPosition}px);`;
}

export function cssStyleElementTimelineVerticalInvertLinePosition({
  v,
  device,
  state,
  prefix
}) {
  const borderWidth = styleBorderWidthGrouped({
    v,
    device,
    prefix: "line"
  });
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const rightPosition = textWidth + halfIconWidth - borderWidth / 2;
  const orientation = styleElementTimelineOrientation({ v, device, state });
  const style = styleElementTimelineStyle({ v, device, state });
  if (orientation === "on" && style === "style-2")
    return `right: ${rightPosition}px;`;
}

export function cssStyleElementTimelineCustomLineTop({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  const borderWidthLine = styleBorderWidthGrouped({ v, prefix: "line" });
  const halfIconHeight = cssStyleElementTimelineIconHalfHeightWidth({ v });
  const textHeight = cssStyleElementTimelineTextHeight({ v, device });
  const borderWidth = styleBorderWidthGrouped({ v, device });
  const customSize = styleElementTimelineIconCustomSize({ v, device });
  const iconPadding = styleElementTimelineIconPadding({ v, device });
  const iconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const verticalPosition = textWidth + iconWidth - borderWidthLine / 2;

  const horizontalLeftPosition =
    customSize + iconPadding * 2 + borderWidth * 2 + 20;

  const afterHeight = halfIconHeight + textHeight - borderWidthLine / 2;

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return `bottom:auto; right: auto; left: ${horizontalLeftPosition}px;`;
      }
      case "style-2": {
        return `bottom: ${afterHeight}px; top:auto; right: auto; left: ${horizontalLeftPosition}px;`;
      }
      case "style-3": {
        return `bottom: ${halfIconHeight}px; top: unset; right: auto; left: ${horizontalLeftPosition}px;`;
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `left: ${verticalPosition}px;`;
      }
      case "style-2": {
        return `right: ${verticalPosition}px; left: auto;`;
      }
      case "style-3": {
        return `left: ${verticalPosition}px;`;
      }
    }
  }
}

export function cssStyleElementTimelineCustomLineOdd({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  const borderWidthLine = styleBorderWidthGrouped({ v, prefix: "line" });
  const halfIconHeight = cssStyleElementTimelineIconHalfHeightWidth({ v });
  const textHeight = cssStyleElementTimelineTextHeight({ v, device });
  const iconHeight = cssStyleElementTimelineIconHalfHeightWidth({
    v
  });
  const borderWidth = styleBorderWidthGrouped({ v, device });
  const customSize = styleElementTimelineIconCustomSize({ v, device });
  const iconPadding = styleElementTimelineIconPadding({ v, device });
  const textWidth = cssStyleElementTimelineTextWidth({ v });

  const verticalPosition = textWidth + iconHeight - borderWidthLine / 2;

  const leftPosition = customSize + iconPadding * 2 + borderWidth * 2 + 20;

  const afterHeight = halfIconHeight + textHeight - borderWidthLine / 2;

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return `top: ${afterHeight}px; bottom:auto; right: auto; left: ${leftPosition}px;`;
      }
      case "style-2": {
        return `bottom: ${afterHeight}px; top:auto; right: auto; left: ${leftPosition}px;`;
      }
      case "style-3": {
        return `top: ${halfIconHeight}px; bottom: unset; right: auto; left: ${leftPosition}px;`;
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `top: calc( ${iconHeight}px + 50%); left: ${verticalPosition}px;`;
      }
      case "style-2": {
        return `top: calc( ${iconHeight}px + 50%); right: ${verticalPosition}px; left: auto;`;
      }
      case "style-3": {
        return `top: calc( ${iconHeight}px + 50%); left: ${verticalPosition}px;`;
      }
    }
  }
}

export function cssStyleElementTimelineCustomContentSpacing({
  v,
  device,
  prefix
}) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return `margin: ${spacing}px 10px 0 10px;`;
      }
      case "style-2": {
        return `margin: 0 10px ${spacing}px 10px;`;
      }
      case "style-3": {
        return `margin: 0 10px ${spacing}px 10px;`;
      }
    }
    return `margin: 0  10px ${spacing}px 10px;`;
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `margin: 0 0 0 ${spacing}px;`;
      }
      case "style-2": {
        return `margin: 0 ${spacing}px 0 0;`;
      }
      case "style-3": {
        return `margin: 0 ${spacing}px 0 0;`;
      }
    }
  }
}

export function cssStyleElementTimelineCustomContentBottomSpacing({
  v,
  device,
  prefix
}) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "off" && style === "style-3")
    return `margin: ${spacing}px  10px 0 10px;`;
}

export function cssStyleElementTimelineVerticalCustomTabPosition({
  v,
  device,
  prefix
}) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const position = textWidth + halfIconWidth;
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `left: calc(50% - ${position}px);`;
      }
      case "style-2": {
        return `right: calc(50% - ${position}px); left: auto;`;
      }
      case "style-3": {
        return `right: calc(50% - ${position}px); left: auto;`;
      }
    }
  } else if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return "right: auto; left: auto;";
      }
      case "style-2": {
        return "right: auto; left: auto;";
      }
      case "style-3": {
        return "right: auto; left: auto;";
      }
    }
  }
}

export function cssStyleElementTimelineVerticalCustomTabPositionOdd({
  v,
  device,
  prefix
}) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const leftPosition = textWidth + halfIconWidth;
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `left: calc(50% - ${leftPosition}px);`;
      }
      case "style-2": {
        return "left:auto;";
      }
      case "style-3": {
        return `left: calc(50% - ${leftPosition}px);`;
      }
    }
  } else if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return "left: auto;";
      }
      case "style-2": {
        return "left:auto;";
      }
      case "style-3": {
        return "left: auto;";
      }
    }
  }
}

export function cssStyleElementTimelineVerticalCustomPosition({
  v,
  device,
  prefix
}) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix: "line" });
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const rightPosition = textWidth + halfIconWidth - borderWidth / 2;
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return "";
      }
      case "style-2": {
        return "";
      }
      case "style-3": {
        return "";
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `right: auto; left: ${rightPosition}px;`;
      }
      case "style-2": {
        return "";
      }
      case "style-3": {
        return `right: ${rightPosition}px; left: unset;`;
      }
    }
  }
}

export function cssStyleElementTimelineVerticalStyle3ArrowPosition({
  v,
  device,
  prefix
}) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  const iconWidth = cssStyleElementTimelineIconHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const rightPosition = textWidth + iconWidth + spacing - 7;
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    device
  });

  const arrowPosition = textWidth + iconWidth + spacing - 7;

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return `bottom: auto; top: 0; left: ${halfIconWidth}px;`;
      }
      case "style-2": {
        return `bottom: -15px; top: unset;left: ${halfIconWidth}px;`;
      }
      case "style-3": {
        return `bottom: -15px; top: unset;left: ${halfIconWidth}px;`;
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `bottom: auto; left: ${arrowPosition}px; top: 50%;`;
      }
      case "style-2": {
        return `right: ${rightPosition}px; left: unset;  top: 50%;`;
      }
      case "style-3": {
        return `right: ${rightPosition}px; left: unset;  top: 50%;`;
      }
    }
  }
}

export function cssStyleElementTimelineVerticalCustomContentSpacing({
  v,
  device,
  prefix
}) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "on" && style === "style-3")
    return `margin: 0 ${spacing}px 0 0;`;
}

export function cssStyleElementTimelineWidth({ v, device, state }) {
  const width = styleElementTimelineWidth({ v, device, state });
  const widthSuffix = styleElementTimelineWidthSuffix({
    v,
    device,
    state
  });
  return width === undefined
    ? ""
    : `min-width:${width}${widthSuffix}; width:${width}${widthSuffix};`;
}

export function cssStyleElementTimelineTabContentArrowColor({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return "border-right: transparent ; border-bottom: transparent ; border-left: inherit ; border-top: inherit ;";
      }
      case "style-2": {
        return "border-left: transparent ; border-top: transparent ; border-right: inherit ; border-bottom: inherit ;";
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return "border-top: transparent ; border-right: transparent ; border-left: inherit ; border-bottom: inherit ;";
      }
      case "style-2": {
        return "border-left: transparent ; border-bottom: transparent ; border-right: inherit ; border-top: inherit ;";
      }
    }
  }
}

export function cssStyleElementTimelineTabContentArrowCustomColor({
  v,
  device
}) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "off" && style === "style-3") {
    return "border-left: transparent ; border-top: transparent ; border-right: inherit ; border-bottom: inherit;";
  } else if (orientation === "on" && style === "style-3") {
    return "border-left: transparent; border-bottom: transparent; border-right: inherit; border-top: inherit;";
  }
}

export function cssStyleElementTimelineTabContentArrowCustomColor1({
  v,
  device
}) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "on" && style === "style-3") {
    return "border-right: transparent; border-top: transparent; border-left: inherit; border-bottom: inherit;";
  }
}

export function cssStyleElementTimelineTabs({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });

  if (orientation === "off") {
    return "flex: 1 1 auto; flex-direction: row; width: 100%; display: flex; overflow-x: auto; overflow-y: hidden; padding-bottom: 30px;";
  } else if (orientation === "on") {
    return "display: flex; flex-direction: column; max-width: 100%; overflow-x: unset; overflow-y: unset; padding-bottom: unset; align-items: normal;";
  }
}

export function cssStyleElementTimelineTab({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return "display: flex; align-items: normal; flex-direction: column;";
      }
      case "style-2": {
        return "display: flex; align-items: normal; flex-direction: column-reverse;";
      }
      case "style-3": {
        return "display: flex; align-items: normal; flex-direction: column;";
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return "display: flex; align-items: center; flex-direction: row;";
      }
      case "style-2": {
        return "display: flex; align-items: center; flex-direction: row-reverse;";
      }
      case "style-3": {
        return "display: flex; align-items: center; flex-direction: row;";
      }
    }
  }
}

export function cssStyleElementTimelineTabContentBefore({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  const spacing = styleElementTimelineSpacing({ v, device });
  const textWidth = cssStyleElementTimelineTextWidth({ v, device });
  const iconWidth = cssStyleElementTimelineIconHeightWidth({
    v,
    device
  });
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    device
  });

  const arrowPosition = textWidth + iconWidth + spacing - 7;

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return `bottom: auto; top: 0; left: ${halfIconWidth}px;`;
      }
      case "style-2": {
        return `bottom: -15px; top: unset;left: ${halfIconWidth}px;`;
      }
      case "style-3": {
        return `bottom: -15px; top: unset; left: ${halfIconWidth}px;`;
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return `bottom: auto; left: ${arrowPosition}px; top: 50%;`;
      }
      case "style-2": {
        return `bottom: -15px; right: ${arrowPosition}px; left: unset;  top: 50%;`;
      }
      case "style-3": {
        return `bottom: -15px; left: ${arrowPosition}px; top: 50%;`;
      }
    }
  }
}

export function cssStyleElementTimelineContentBeforeStyle3({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "off" && style === "style-3") {
    return "bottom: unset;";
  } else if (orientation === "off" && style === "style-2") {
    return "bottom: -15px;";
  }
}

export function cssStyleElementTimelineNavTitle({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "off" && style === "style-3") {
    return "position: absolute; top: 0; transform: translateY(-100%);";
  } else if (orientation === "on") {
    return "position: relative; left: -10px; transform: none;";
  } else {
    return "position: relative; transform: none;";
  }
}

export function cssStyleElementTimelineNavTitleStyle3({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return "position: relative; transform: none;";
      }
      case "style-2": {
        return "position: relative; transform: none;";
      }
      case "style-3": {
        return "position: absolute; bottom: 0; top: auto; transform: translateY(100%);";
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return "position: relative; left: -10px; transform: none;";
      }
      case "style-2": {
        return "position: relative; left: -10px; transform: none;";
      }
      case "style-3": {
        return "position: relative; left: -10px; transform: none;";
      }
    }
  }
}

export function cssStyleElementTimelineTabCustomStyle({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return "flex-direction: column;";
      }
      case "style-2": {
        return "flex-direction: column-reverse;";
      }
      case "style-3": {
        return "flex-direction: column-reverse;";
      }
    }
  } else if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return "flex-direction: row;";
      }
      case "style-2": {
        return "flex-direction: row-reverse;";
      }
      case "style-3": {
        return "flex-direction: row-reverse;";
      }
    }
  }
}

export function cssStyleElementTimelineTabHorizontalStyle3Odd({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });

  if (orientation === "on") {
    switch (style) {
      case "style-1": {
        return "flex-direction: row;";
      }
      case "style-2": {
        return "flex-direction: row-reverse;";
      }
      case "style-3": {
        return "flex-direction: row;";
      }
    }
  } else if (orientation === "off") {
    switch (style) {
      case "style-1": {
        return "flex-direction: column;";
      }
      case "style-2": {
        return "flex-direction: column-reverse;";
      }
      case "style-3": {
        return "flex-direction: column;";
      }
    }
  }
}

export function cssStyleElementTimelineTabsHorizontalStyle3({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "off" && style === "style-3") {
    return "align-items: baseline;";
  }
}

export function cssStyleElementTimelineTabsVerticalNavIcon({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  if (orientation === "on") {
    return " margin-left: 0; line-height: 0; z-index: 1;";
  } else if (orientation === "off") {
    return "margin-left: 20px";
  }
}

export function cssStyleElementTimelineTabsVerticalContent({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  if (orientation === "on") {
    return "position: static;";
  } else if (orientation === "off") {
    return "position: relative;";
  }
}

export function cssStyleElementTimelineVerticalTab({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  if (orientation === "on") {
    return "margin-bottom: 100px;";
  } else if (orientation === "off") {
    return "margin-bottom: 0;";
  }
}

export function cssStyleElementTimelineVerticalLastTab({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  if (orientation === "on") {
    return "margin-bottom: 0;";
  }
}

export function cssStyleElementTimelineVerticalTabBeforeNone({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  if (orientation === "on") {
    return "display: none;";
  }
}

export function cssStyleElementTimelineVerticalTabBeforeStyle3({ v, device }) {
  const orientation = styleElementTimelineOrientation({ v, device });
  const style = styleElementTimelineStyle({ v, device });
  if (orientation === "on" && style === "style-3") {
    return "display: none;";
  }
}
