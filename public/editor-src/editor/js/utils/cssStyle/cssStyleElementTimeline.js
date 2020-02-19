import {
  styleTypography2FontSize,
  styleTypography2LineHeight,
  styleBorderWidthGrouped,
  styleBorderColor,
  styleBorderRadiusGrouped,
  styleElementTimelineWidth,
  styleElementTimelineWidthSuffix,
  styleElementTimelineIconCustomSize,
  styleElementTimelineIconPadding,
  styleElementTimelineEnableText,
  styleElementTimelineSpacing,
  styleElementTimelineTabsCount
} from "visual/utils/style2";

function cssStyleElementTimelineIconHeightWidth({ v, device, prefix }) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  const customSize = styleElementTimelineIconCustomSize({ v, device, prefix });
  const iconPadding = styleElementTimelineIconPadding({ v, device, prefix });
  const iconHeight = customSize + iconPadding * 2 + borderWidth * 2;
  return iconHeight;
}

function cssStyleElementTimelineIconHalfHeightWidth({ v, state, prefix }) {
  const fullSize = cssStyleElementTimelineIconHeightWidth({
    v,
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
  const textHeight = enableText ? fontSize * lineHeight : 0;
  return textHeight;
}

function cssStyleElementTimelineTextWidth({ v, device, prefix }) {
  const enableText = cssStyleElementTimelineEnableText({ v, device, prefix });
  const textWidth = enableText ? 116 : 0;
  return textWidth;
}

export function cssStyleElementTimelineArrowBorderTopColor({
  v,
  device,
  prefix
}) {
  const borderColor = styleBorderColor({ v, device, prefix });
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  return `border-top: ${borderWidth}px solid ${borderColor};`;
}

export function cssStyleElementTimelineArrowBorderBottomColor({
  v,
  device,
  prefix
}) {
  const borderColor = styleBorderColor({ v, device, prefix });
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  return `border-bottom:  ${borderWidth}px solid ${borderColor};`;
}

export function cssStyleElementTimelineArrowBorderRightColor({
  v,
  device,
  prefix
}) {
  const borderColor = styleBorderColor({ v, device, prefix });
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  return `border-right:  ${borderWidth}px solid ${borderColor};`;
}

export function cssStyleElementTimelineArrowBorderLeftColor({
  v,
  device,
  prefix
}) {
  const borderColor = styleBorderColor({ v, device, prefix });
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  return `border-left: ${borderWidth}px solid ${borderColor};`;
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
  const disp = enableText ? "display: block;" : "display: none;";
  return disp;
}

export function cssStyleElementTimelineAfterLineHeight({ v, device }) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix: "line" });
  return `height: ${borderWidth}px;`;
}

export function cssStyleElementTimelineLineBgColor({ v, device }) {
  const borderColor = styleBorderColor({ v, device, prefix: "line" });
  return `background-color: ${borderColor};`;
}

export function cssStyleElementTimelineLineWidth({ v, prefix }) {
  const iconWidth = cssStyleElementTimelineIconHeightWidth({
    v,
    prefix
  });
  return `width: calc(100% - ${iconWidth}px);`;
}

export function cssStyleElementTimelineLineTop({ v, device, prefix }) {
  const borderWidth = styleBorderWidthGrouped({ v, prefix: "line" });
  const halfIconHeight = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textHeight = cssStyleElementTimelineTextHeight({ v, device, prefix });
  const afterHeight = halfIconHeight + textHeight - borderWidth / 2;
  return `top: ${afterHeight}px;`;
}

export function cssStyleElementTimelineLineLeftPosition({ v, device, prefix }) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  const customSize = styleElementTimelineIconCustomSize({ v, device, prefix });
  const iconPadding = styleElementTimelineIconPadding({ v, device, prefix });
  const leftPosition = customSize + iconPadding * 2 + borderWidth * 2 + 20;
  return `left: ${leftPosition}px;`;
}

export function cssStyleElementTimelineContentSpacing({ v, device, prefix }) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  return `margin-top: ${spacing}px;`;
}

export function cssStyleElementTimelineArrowBorder({ v, device, prefix }) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  return `border: ${borderWidth}px solid transparent;`;
}

export function cssStyleElementTimelineArrowPosition({ v, prefix }) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  return `left: ${halfIconWidth}px;`;
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

// Vertical
export function cssStyleElementTimelineVerticalPosition({ v, prefix }) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const leftPosition = textWidth + halfIconWidth;
  return `left: calc(50% - ${leftPosition}px);`;
}

export function cssStyleElementTimelineVerticalLineHeight({ v, prefix }) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  return `height: calc(100px + (50% - ${halfIconWidth}px));`;
}

export function cssStyleElementTimelineVerticalLineWidth({ v, device }) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix: "line" });
  return `width: ${borderWidth}px;`;
}

export function cssStyleElementTimelineVerticalLinePosition({
  v,
  device,
  prefix
}) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix: "line" });
  const iconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const leftPosition = textWidth + iconWidth - borderWidth / 2;
  return `left: ${leftPosition}px;`;
}

export function cssStyleElementTimelineVerticalLineTopPosition({ v, prefix }) {
  const iconHeight = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  return `top: calc( ${iconHeight}px + 50%);`;
}

export function cssStyleElementTimelineVerticalLineBottomPosition({
  v,
  prefix
}) {
  const iconHeight = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  return `bottom: calc( ${iconHeight}px + 50%);`;
}

export function cssStyleElementTimelineVerticalSpacing({ v, device, prefix }) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  return `margin: 0 0 0 ${spacing}px;`;
}

export function cssStyleElementTimelineVerticalArrowBorder({
  v,
  device,
  prefix
}) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  return `border: ${borderWidth}px solid transparent;`;
}

export function cssStyleElementTimelineVerticalArrowPosition({
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
  const leftPosition = textWidth + iconWidth + spacing - 7;
  return `left: ${leftPosition}px; top: 50%;`;
}

export function cssStyleElementTimelineCustomTabWidth({ v, device, prefix }) {
  const tabsCount = styleElementTimelineTabsCount({ v, device, prefix });
  const tabWidth = 100 / tabsCount;
  return `width: ${tabWidth}%;  min-width: ${tabWidth}%;`;
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

// Vertical invert
export function cssStyleElementTimelineVerticalInvertPosition({ v, prefix }) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const rightPosition = textWidth + halfIconWidth;
  return `right: calc(50% - ${rightPosition}px);`;
}

export function cssStyleElementTimelineVerticalInvertLinePosition({
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
  return `right: ${rightPosition}px;`;
}

export function cssStyleElementTimelineVerticalInvertSpacing({
  v,
  device,
  prefix
}) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  return `margin: 0 ${spacing}px 0 0;`;
}

export function cssStyleElementTimelineVerticalInvertArrowPosition({
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
  return `right: ${rightPosition}px; left: unset;  top: 50%;`;
}

export function cssStyleElementTimelineVerticalInvertArrowBorder({
  v,
  device,
  prefix
}) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  return `border: ${borderWidth}px solid transparent;`;
}

// Invert
export function cssStyleElementTimelineTopLinePosition({ v, device, prefix }) {
  const borderWidth = styleBorderWidthGrouped({ v, prefix: "line" });
  const halfIconHeight = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textHeight = cssStyleElementTimelineTextHeight({ v, device, prefix });
  const afterHeight = halfIconHeight + textHeight - borderWidth / 2;
  return `bottom: ${afterHeight}px;`;
}

export function cssStyleElementTimelineTopTabsArrowBorder({
  v,
  device,
  prefix
}) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  return `border: ${borderWidth}px solid transparent;`;
}

export function cssStyleElementTimelineTopContentSpacing({
  v,
  device,
  prefix
}) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  return `margin: 0 10px ${spacing}px 10px;`;
}

// Custom
export function cssStyleElementTimelineCustomPosition({ v, device, prefix }) {
  const iconHeight = cssStyleElementTimelineIconHeightWidth({
    v,
    prefix
  });
  const textHeight = cssStyleElementTimelineTextHeight({ v, device, prefix });
  const enableText = cssStyleElementTimelineEnableText({ v });
  const bottom = enableText ? textHeight + iconHeight : 0;
  return `bottom: ${bottom}px;`;
}

export function cssStyleElementTimelineCustomArrowBorder({
  v,
  device,
  prefix
}) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  return `border: ${borderWidth}px solid transparent;`;
}

export function cssStyleElementTimelineCustomLineTop({ v, device, prefix }) {
  const borderWidth = styleBorderWidthGrouped({ v, device, prefix });
  const halfIconHeight = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textHeight = cssStyleElementTimelineTextHeight({ v, device, prefix });
  const afterHeight = halfIconHeight + textHeight - borderWidth / 2;
  return `bottom: ${afterHeight}px; top: unset;`;
}

export function cssStyleElementTimelineCustomContentTopSpacing({
  v,
  device,
  prefix
}) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  return `margin: 0  10px ${spacing}px 10px;`;
}

export function cssStyleElementTimelineCustomContentBottomSpacing({
  v,
  device,
  prefix
}) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  return `margin: ${spacing}px  10px 0 10px;`;
}

// Vertical custom
export function cssStyleElementTimelineVerticalCustomTabPosition({
  v,
  prefix
}) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const rightPosition = textWidth + halfIconWidth;
  return `right: calc(50% - ${rightPosition}px); left: unset;`;
}

export function cssStyleElementTimelineVerticalCustomTabPositionOdd({
  v,
  prefix
}) {
  const halfIconWidth = cssStyleElementTimelineIconHalfHeightWidth({
    v,
    prefix
  });
  const textWidth = cssStyleElementTimelineTextWidth({ v });
  const leftPosition = textWidth + halfIconWidth;
  return `left: calc(50% - ${leftPosition}px);`;
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
  return `right: ${rightPosition}px; left: unset;`;
}

export function cssStyleElementTimelineVerticalCustomArrowPosition({
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
  return `right: ${rightPosition}px; left: unset;  top: 50%;`;
}

export function cssStyleElementTimelineVerticalCustomContentSpacing({
  v,
  device,
  prefix
}) {
  const spacing = styleElementTimelineSpacing({ v, device, prefix });
  return `margin: 0 ${spacing}px 0 0;`;
}

export function cssStyleElementTimelineWidth({ v, device, state }) {
  const width = styleElementTimelineWidth({ v, device, state });
  const widthSuffix = styleElementTimelineWidthSuffix({
    v,
    device,
    state
  });
  return width === undefined ? "" : `max-width:${width}${widthSuffix};`;
}
