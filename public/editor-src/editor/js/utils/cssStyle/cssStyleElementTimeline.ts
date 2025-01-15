import { checkValue2 } from "visual/utils/checkValue";
import {
  cssStyleDisplayBlock,
  cssStyleDisplayGrid,
  cssStyleDisplayNone,
  cssStylePositionAbsolute,
  cssStylePositionRelative,
  cssStylePositionStatic
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { styleBorderColor } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";

enum IconType {
  small = "small",
  medium = "medium",
  large = "large",
  custom = "custom"
}
enum Style {
  style1 = "style-1",
  style2 = "style-2",
  style3 = "style-3"
}
enum Orientation {
  on = "on",
  off = "off"
}

const getIconType = checkValue2<IconType>(IconType);
const getStyle = checkValue2<Style>(Style);
const getOrientation = checkValue2<Orientation>(Orientation);

function styleElementTimelineLineForIcon({ v, device }: CSSValue): number {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const size = getIconType(dvv("size"));
  const customSize = dvv("customSize");

  switch (size) {
    case IconType.small:
      return 32;
    case IconType.medium:
      return 48;
    case IconType.large:
      return 64;
    case IconType.custom:
      return customSize;
    case undefined:
      return 0;
  }
}

const isStyle3Horizontal = (
  orientation: "on" | "off",
  style: "style-1" | "style-2" | "style-3"
) => {
  return orientation === "off" && style === "style-3";
};

function styleElementTimelineIconHeightWidth({
  v,
  device,
  state,
  store
}: CSSValue): number {
  const iconSize = styleElementTimelineLineForIcon({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const borderWidth = dvv("borderWidth");
  const iconPadding = dvv("iconPadding");

  return iconSize + iconPadding * 2 + borderWidth * 2;
}

function styleElementTimelineIconHalf({
  v,
  device,
  state,
  store,
  prefix
}: CSSValue): number {
  const fullSize = styleElementTimelineIconHeightWidth({
    v,
    device,
    state,
    store,
    prefix
  });

  return fullSize / 2;
}

function styleElementTimelineEnableText({ v, device }: CSSValue): boolean {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const enableText = dvv("enableText");

  return enableText === "on";
}

function styleElementTimelineTextHeight({
  v,
  device,
  state,
  store
}: CSSValue): number {
  const enableText = styleElementTimelineEnableText({
    v,
    device,
    state,
    store
  });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const fontSize = dvv("typographyFontSize");
  const lineHeight = dvv("typographyLineHeight");

  return enableText ? fontSize * lineHeight : 0;
}

function styleElementTimelineTextWidth({
  v,
  device,
  state,
  store
}: CSSValue): number {
  const enableText = styleElementTimelineEnableText({
    v,
    device,
    state,
    store
  });

  return enableText ? 116 : 0;
}

export function cssStyleElementTimelineIconSize({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const iconSize = styleElementTimelineLineForIcon({ v, device, state, store });

  return `font-size: ${iconSize}px;`;
}

export function cssStyleElementTimelinePaddingForIcon({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const iconPadding = dvv("iconPadding");

  return `padding: ${iconPadding}px;`;
}

export function cssStyleElementTimelineIconWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const iconWidth = styleElementTimelineIconHeightWidth({
    v,
    device,
    state,
    store
  });
  return `width: ${iconWidth}px;`;
}

export function cssStyleElementTimelineIconHeight({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const iconHeight = styleElementTimelineIconHeightWidth({
    v,
    device,
    state,
    store
  });
  return `height: ${iconHeight}px;`;
}

export function cssStyleElementTimelineNavTitleWidth({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const iconWidth = styleElementTimelineIconHeightWidth({
    v,
    device,
    state,
    store
  });
  const titleWidth = iconWidth + 60;

  return `width: ${titleWidth}px;`;
}

export function cssStyleElementTimelineNavTitleVisible({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const enableText = styleElementTimelineEnableText({
    v,
    device,
    state,
    store
  });

  return enableText ? cssStyleDisplayBlock() : cssStyleDisplayNone();
}

export function cssStyleElementTimelineLineBgColor({
  v,
  device,
  state
}: CSSValue): string {
  const borderColor = styleBorderColor({ v, device, state, prefix: "line" });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const borderStyle = dvv("lineBorderStyle");
  const borderWidth = dvv("lineBorderWidth");

  return orientation === "off"
    ? `border-top: ${borderColor} ${borderWidth}px ${borderStyle};`
    : `border-left: ${borderColor} ${borderWidth}px ${borderStyle};border-top:0;`;
}

export function cssStyleElementTimelineLineTop({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const halfIconHeight = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const textHeight = styleElementTimelineTextHeight({
    v,
    device,
    state,
    store
  });
  const iconHeight = styleElementTimelineIconHalf({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const style = getStyle(dvv("timelineStyle"));
  const orientation = getOrientation(dvv("verticalMode"));
  const iconSize = styleElementTimelineLineForIcon({ v, device, state, store });
  const iconPadding = dvv("iconPadding");
  const borderWidth = dvv("borderWidth");
  const borderWidthLine = dvv("lineBorderWidth");

  const leftPosition = iconSize + iconPadding * 2 + borderWidth * 2 + 20;
  const afterHeight = halfIconHeight + textHeight - borderWidthLine / 2;

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1: {
          return `top:${afterHeight}px; bottom:auto; left:${leftPosition}px;`;
        }
        case Style.style2: {
          return `bottom: ${afterHeight}px; top:auto; left: ${leftPosition}px;`;
        }
        case Style.style3: {
          return `top: calc( ${afterHeight}px + 50%); bottom:auto; left: ${leftPosition}px;`;
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1:
        case Style.style2:
        case Style.style3: {
          return `top: calc( ${iconHeight}px + 50%);`;
        }
      }
      break;
    }
  }

  return "";
}

export function cssStyleElementTimelineContentSpacing({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const spacing = dvv("spacing");
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return `margin: ${spacing}px 10px 0 10px;`;
        }
        case Style.style2: {
          return `margin: 0 10px ${spacing}px 10px;`;
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return `margin: 0 0 0 ${spacing}px;`;
        }
        case Style.style2: {
          return `margin: 0 ${spacing}px 0 0;`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineVerticalPosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));

  const position = textWidth + halfIconWidth;

  switch (orientation) {
    case Orientation.on: {
      switch (style) {
        case Style.style1: {
          return `left: calc(50% - ${position}px); right: auto;`;
        }
        case Style.style2: {
          return `right: calc(50% - ${position}px); left: auto;`;
        }
      }
      break;
    }
    case Orientation.off: {
      return "left: auto; right: auto;";
    }
  }
  return "";
}

export function cssStyleElementTimelineLineWidthHeightBefore({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const iconWidth = styleElementTimelineIconHeightWidth({
    v,
    device,
    state,
    store
  });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const borderWidth = dvv("lineBorderWidth");

  switch (orientation) {
    case Orientation.on: {
      return `height: calc(50% + (${halfIconWidth}px)); width: ${borderWidth}px;`;
    }
    case Orientation.off: {
      return `width: calc(100% - ${iconWidth}px); height: ${borderWidth}px;`;
    }
    case undefined:
      return "";
  }
}

export function cssStyleElementTimelineLineWidthHeightAfter({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const borderWidth = dvv("lineBorderWidth");
  const orientation = getOrientation(dvv("verticalMode"));

  const verticalSpacing = dvv("verticalSpacing");
  const horizontalSpacing = dvv("horizontalSpacing");

  switch (orientation) {
    case Orientation.off: {
      return `width: calc(100% + ${horizontalSpacing}px); height: ${borderWidth}px;`;
    }
    case Orientation.on: {
      return `height: calc(${verticalSpacing}px + (50% + ${halfIconWidth}px)); width: ${borderWidth}px; left: ${borderWidth}px;`;
    }
    case undefined:
      return "";
  }
}

export function cssStyleElementTimelineVerticalLinePosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const iconWidth = styleElementTimelineIconHalf({ v, device, state, store });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));
  const borderWidth = dvv("lineBorderWidth");

  const linePosition = textWidth + iconWidth - borderWidth / 2;

  if (orientation === "on") {
    switch (style) {
      case Style.style1:
      case Style.style3: {
        return `left: ${linePosition}px; bottom: calc( ${iconWidth}px + 50%);`;
      }
      case Style.style2: {
        return `right: ${linePosition}px; bottom: calc( ${iconWidth}px + 50%); left:unset;`;
      }
    }
  }
  return "";
}

export function cssStyleElementTimelineBeforeDisplay({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");

  return orientation === "on" ? cssStyleDisplayBlock() : cssStyleDisplayNone();
}

export function cssStyleElementTimelineVerticalLineTopPosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const iconHeight = styleElementTimelineIconHalf({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");

  return orientation === "on" ? `top: calc( ${iconHeight}px + 50%);` : "";
}

export function cssStyleElementTimelineVerticalLineBottomPosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const iconHeight = styleElementTimelineIconHalf({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = getStyle(dvv("timelineStyle"));

  return orientation === "on" &&
    (style === "style-1" || style === "style-2" || style === "style-3")
    ? `bottom: calc(${iconHeight}px + 50%);`
    : "";
}

export function cssStyleElementTimelineCustomTabWidth({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const tabsCount = dvv("tabsCount");
  const orientation = dvv("verticalMode");

  const tabWidth = 100 / tabsCount;

  return orientation === "off"
    ? `width:${tabWidth}%; min-width:${tabWidth}%;`
    : "width:auto;  min-width:auto;";
}

export function cssStyleElementTimelineCustomLastTabWidth({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const tabsCount = dvv("tabsCount");

  const tabWidth = 100 / tabsCount;

  return `width: calc(${tabWidth}% - 30px);  min-width:calc(${tabWidth}% - 30px);`;
}

export function cssStyleElementTimelineVerticalInvertPosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  const rightPosition = textWidth + halfIconWidth;

  return orientation === "on" && style === "style-2"
    ? `right: calc(50% - ${rightPosition}px);`
    : "";
}

export function cssStyleElementTimelineVerticalInvertLinePosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");
  const borderWidth = dvv("lineBorderWidth");

  const rightPosition = textWidth + halfIconWidth - borderWidth / 2;

  return orientation === "on" && style === "style-2"
    ? `right: ${rightPosition}px;`
    : "";
}

export function cssStyleElementTimelineCustomLineTop({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));
  const enableText = styleElementTimelineEnableText({
    v,
    device,
    state,
    store
  });
  const textSpacing = enableText ? dvv("textSpacing") : 0;
  const borderWidth = dvv("borderWidth");
  const borderWidthLine = dvv("lineBorderWidth");
  const iconSize = styleElementTimelineLineForIcon({ v, device, state, store });
  const iconPadding = dvv("iconPadding");

  const halfIconHeight = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const textHeight = styleElementTimelineTextHeight({
    v,
    device,
    state,
    store
  });
  const iconWidth = styleElementTimelineIconHalf({ v, device, state, store });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });

  const verticalPosition = textWidth + iconWidth - borderWidthLine / 2;
  const horizontalLeftPosition =
    iconSize + iconPadding * 2 + borderWidth * 2 + 20;
  const afterHeight2 =
    halfIconHeight + textHeight + textSpacing - borderWidthLine / 2;

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1: {
          return `bottom:auto; right: auto; top: ${afterHeight2}px; left: ${horizontalLeftPosition}px;`;
        }
        case Style.style2: {
          return `bottom: ${afterHeight2}px; top:auto; right: auto; left: ${horizontalLeftPosition}px;`;
        }
        case Style.style3: {
          return `bottom: ${halfIconHeight}px; top: unset; right: auto; left: ${horizontalLeftPosition}px;`;
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return `left: ${verticalPosition}px; top: calc(50% + ${halfIconHeight}px);`;
        }
        case Style.style2: {
          return `right: ${verticalPosition}px; left: auto; top: calc(50% + ${halfIconHeight}px);`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineCustomLineOdd({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));
  const enableText = styleElementTimelineEnableText({
    v,
    device,
    state,
    store
  });
  const textSpacing = enableText ? dvv("textSpacing") : 0;
  const borderWidth = dvv("borderWidth");
  const borderWidthLine = dvv("lineBorderWidth");
  const iconSize = styleElementTimelineLineForIcon({ v, device, state, store });
  const iconPadding = dvv("iconPadding");

  const halfIconHeight = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const textHeight = styleElementTimelineTextHeight({
    v,
    device,
    state,
    store
  });
  const iconHeight = styleElementTimelineIconHalf({ v, device, state, store });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });

  const verticalPosition = textWidth + iconHeight - borderWidthLine / 2;
  const leftPosition = iconSize + iconPadding * 2 + borderWidth * 2 + 20;
  const afterHeight =
    halfIconHeight + textHeight + textSpacing - borderWidthLine / 2;

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1: {
          return `top: ${afterHeight}px; bottom:auto; right: auto; left: ${leftPosition}px;`;
        }
        case Style.style2: {
          return `bottom: ${afterHeight}px; top:auto; right: auto; left: ${leftPosition}px;`;
        }
        case Style.style3: {
          return `top: ${halfIconHeight}px; bottom: unset; right: auto; left: ${leftPosition}px;`;
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return `top: calc( ${iconHeight}px + 50%); left: ${verticalPosition}px;`;
        }
        case Style.style2: {
          return `top: calc( ${iconHeight}px + 50%); right: ${verticalPosition}px; left: auto;`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineCustomContentSpacing({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const spacing = dvv("spacing");
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1: {
          return `margin: ${spacing}px 10px 0 10px;`;
        }
        case Style.style2:
        case Style.style3: {
          return `margin: 0 10px ${spacing}px 10px;`;
        }
      }
      return `margin: 0  10px ${spacing}px 10px;`;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1: {
          return `margin: 0 0 0 ${spacing}px;`;
        }
        case Style.style2:
        case Style.style3: {
          return `margin: 0 ${spacing}px 0 0;`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineCustomContentBottomSpacing({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const spacing = dvv("spacing");
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  return orientation === "off" && style === "style-3"
    ? `margin: ${spacing}px  10px 0 10px;`
    : "";
}

export function cssStyleElementTimelineVerticalCustomTabPosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));

  const position = textWidth + halfIconWidth;

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1:
        case Style.style2:
        case Style.style3: {
          return "right: auto; left: auto;";
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1: {
          return `left: calc(50% - ${position}px);`;
        }
        case Style.style2:
        case Style.style3: {
          return `right: calc(50% - ${position}px); left: auto;`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineVerticalCustomTabPositionOdd({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));

  const leftPosition = textWidth + halfIconWidth;

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1:
        case Style.style2:
        case Style.style3: {
          return "left: auto;";
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return `left: calc(50% - ${leftPosition}px);`;
        }
        case Style.style2: {
          return "left:auto;";
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineVerticalCustomPosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));
  const borderWidth = dvv("lineBorderWidth");

  const rightPosition = textWidth + halfIconWidth - borderWidth / 2;

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1:
        case Style.style2:
        case Style.style3: {
          return "";
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1: {
          return `right: auto; left: ${rightPosition}px;`;
        }
        case Style.style2: {
          return `right: ${rightPosition}px; left: auto;`;
        }
        case Style.style3: {
          return `right: ${rightPosition}px; left: unset;`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineVerticalStyle3ArrowPosition({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const iconWidth = styleElementTimelineIconHeightWidth({
    v,
    device,
    state,
    store
  });
  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });

  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));
  const spacing = dvv("spacing");

  const position = textWidth + iconWidth + spacing - 7;

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1: {
          return `bottom: auto; top: 0; left: ${halfIconWidth}px;`;
        }
        case Style.style2:
        case Style.style3: {
          return `bottom: -15px; top: unset;left: ${halfIconWidth}px;`;
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1: {
          return `bottom: auto; left: ${position}px; top: 50%;`;
        }
        case Style.style2:
        case Style.style3: {
          return `right: ${position}px; left: unset;  top: 50%;`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineVerticalCustomContentSpacing({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");
  const spacing = dvv("spacing");

  return orientation === "on" && style === "style-3"
    ? `margin: 0 ${spacing}px 0 0;`
    : "";
}

export function cssStyleElementTimelineHorizontalSpaceBetween({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const horizontalSpacing = dvv("horizontalSpacing");

  if (orientation === "off") {
    return `column-gap: ${horizontalSpacing}px;`;
  }

  return "";
}

export function cssStyleElementTimelineTabContentArrowColor({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1: {
          return "border-right: transparent; border-bottom: transparent; border-left: inherit; border-top: inherit;";
        }
        case Style.style2: {
          return "border-left: transparent; border-top: transparent; border-right: inherit; border-bottom: inherit;";
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1: {
          return "border-top: transparent; border-right: transparent; border-left: inherit; border-bottom: inherit;";
        }
        case Style.style2: {
          return "border-left: transparent; border-bottom: transparent; border-right: inherit; border-top: inherit;";
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineTabContentArrowCustomColor({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  return orientation === "off" && style === "style-3"
    ? "border-left: transparent ; border-top: transparent ; border-right: inherit ; border-bottom: inherit;"
    : orientation === "on" && style === "style-3"
      ? "border-left: transparent; border-bottom: transparent; border-right: inherit; border-top: inherit;"
      : "";
}

export function cssStyleElementTimelineTabContentArrowCustomColor1({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  return orientation === "on" && style === "style-3"
    ? "border-right: transparent; border-top: transparent; border-left: inherit; border-bottom: inherit;"
    : "";
}

export function cssStyleElementTimelineTabs({ v, device }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");

  return orientation === "off"
    ? "flex: 1 1 auto; flex-direction: row; width: 100%; display: flex; overflow-x: auto; overflow-y: hidden; padding-bottom: 30px;"
    : orientation === "on"
      ? "display: flex; flex-direction: column; max-width: 100%; overflow-x: unset; overflow-y: unset; padding-bottom: unset; align-items: normal;"
      : "";
}

export function cssStyleElementTimelineTab({ v, device }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return "display: flex; align-items: normal; flex-direction: column;";
        }
        case Style.style2: {
          return "display: flex; align-items: normal; flex-direction: column-reverse;";
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return "display: flex; align-items: center; flex-direction: row;";
        }
        case Style.style2: {
          return "display: flex; align-items: center; flex-direction: row-reverse;";
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineTabContentBefore({
  v,
  device,
  state,
  store
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));
  const spacing = dvv("spacing");

  const textWidth = styleElementTimelineTextWidth({ v, device, state, store });
  const iconWidth = styleElementTimelineIconHeightWidth({
    v,
    device,
    state,
    store
  });
  const halfIconWidth = styleElementTimelineIconHalf({
    v,
    device,
    state,
    store
  });

  const arrowPosition = textWidth + iconWidth + spacing - 7;

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1: {
          return `bottom: auto; top: 0; left: ${halfIconWidth}px;`;
        }
        case Style.style2:
        case Style.style3: {
          return `bottom: -15px; top: unset;left: ${halfIconWidth}px;`;
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1: {
          return `bottom: auto; left: ${arrowPosition}px; top: 50%;`;
        }
        case Style.style2: {
          return `bottom: -15px; right: ${arrowPosition}px; left: unset;  top: 50%;`;
        }
        case Style.style3: {
          return `bottom: -15px; left: ${arrowPosition}px; top: 50%;`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineContentBeforeStyle3({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  return orientation === "off" && style === "style-3"
    ? "bottom: unset;"
    : orientation === "off" && style === "style-2"
      ? "bottom: -15px;"
      : "";
}

export function cssStyleElementTimelineNavTitleSpacing({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));
  const textSpacing = dvv("textSpacing");

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1: {
          return `${cssStylePositionRelative()} margin-bottom: ${textSpacing}px; left: -10px; top: auto; transform: none;`;
        }
        case Style.style2: {
          return `${cssStylePositionRelative()} margin-top: ${textSpacing}px; left: -10px; top: auto; transform: none;`;
        }
        case Style.style3: {
          return `${cssStylePositionAbsolute()} margin-top: auto; margin-bottom: auto; top: ${-textSpacing}px; left: -10px; transform: translateY(-100%);`;
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return `${cssStylePositionRelative()} margin: 0; left: ${-textSpacing}px; top: auto; transform: none;`;
        }
        case Style.style2: {
          return `${cssStylePositionRelative()} margin: 0; top: auto; left: ${textSpacing}px; transform: none;`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineNavTitleStyle3({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));
  const textSpacing = dvv("textSpacing");

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1:
        case Style.style2: {
          return `${cssStylePositionRelative()} left: -10px; bottom: auto; transform: none;`;
        }
        case Style.style3: {
          return `${cssStylePositionAbsolute()} bottom: ${-textSpacing}px; top: auto; left: -10px; transform: translateY(100%);`;
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1: {
          return `${cssStylePositionRelative()} left: ${-textSpacing}px; bottom: auto; transform: none;`;
        }
        case Style.style2: {
          return `${cssStylePositionRelative()} bottom: auto; left: ${textSpacing}px; transform: none;`;
        }
        case Style.style3: {
          return `${cssStylePositionRelative()} left: ${textSpacing}px; bottom: auto; transform: none;`;
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineTabCustomStyle({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));

  switch (orientation) {
    case Orientation.off: {
      switch (style) {
        case Style.style1: {
          return "flex-direction: column;";
        }
        case Style.style2:
        case Style.style3: {
          return "flex-direction: column-reverse;";
        }
      }
      break;
    }
    case Orientation.on: {
      switch (style) {
        case Style.style1: {
          return "flex-direction: row;";
        }
        case Style.style2:
        case Style.style3: {
          return "flex-direction: row-reverse;";
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineTabHorizontalStyle3Odd({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = getOrientation(dvv("verticalMode"));
  const style = getStyle(dvv("timelineStyle"));

  switch (orientation) {
    case Orientation.on: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return "flex-direction: row;";
        }
        case Style.style2: {
          return "flex-direction: row-reverse;";
        }
      }
      break;
    }
    case Orientation.off: {
      switch (style) {
        case Style.style1:
        case Style.style3: {
          return "flex-direction: column;";
        }
        case Style.style2: {
          return "flex-direction: column-reverse;";
        }
      }
      break;
    }
  }
  return "";
}

export function cssStyleElementTimelineTabsHorizontalStyle3({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  return orientation === "off" && style === "style-3"
    ? "align-items: baseline;"
    : "";
}

export function cssStyleElementTimelineTabsVerticalNavIcon({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");

  return orientation === "on"
    ? "margin-left: 0; line-height: 0; z-index: 1;"
    : orientation === "off"
      ? "margin-left: 20px"
      : "";
}

export function cssStyleElementTimelineTabsVerticalContent({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");

  return orientation === "on"
    ? cssStylePositionStatic()
    : cssStylePositionRelative();
}

export function cssStyleElementTimelineVerticalTab({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const verticalSpacing = dvv("verticalSpacing");

  return orientation === "on"
    ? `margin-bottom: ${verticalSpacing}px;`
    : orientation === "off"
      ? "margin-bottom: 0;"
      : "";
}

export function cssStyleElementTimelineVerticalLastTab({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");

  return orientation === "on" ? "margin-bottom: 0;" : "";
}

export function cssStyleElementTimelineVerticalTabBeforeNone({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");

  return orientation === "on" ? cssStyleDisplayNone() : "";
}

export function cssStyleElementTimelineVerticalTabBeforeStyle3({
  v,
  device
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  return orientation === "on" && style === "style-3"
    ? cssStyleDisplayNone()
    : "";
}

export const cssStyleElementTimelineHorizontalStyle3GridTemplateColumns = ({
  v,
  device
}: CSSValue): string => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  if (isStyle3Horizontal(orientation, style)) {
    const itemsNumber = v.items?.length ?? 1;
    const columnsNumber = dvv("tabsCount");

    return `grid-template-columns: repeat(${itemsNumber}, ${
      100 / columnsNumber
    }%);`;
  }

  return "";
};

export const cssStyleElementTimelineHorizontalStyle3GridTemplateRows = ({
  v,
  device,
  state,
  store
}: CSSValue): string => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  if (isStyle3Horizontal(orientation, style)) {
    const iconHeight = styleElementTimelineIconHeightWidth({
      v,
      device,
      state,
      store
    });

    return `${cssStyleDisplayGrid()}grid-template-rows: 1fr ${iconHeight}px max-content;`;
  }

  return "";
};

export const cssStyleElementTimelineHoziontalStyle3TabStyles = ({
  v,
  device
}: CSSValue): string => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  if (isStyle3Horizontal(orientation, style)) {
    return "grid-column: auto/auto;display: flex;flex-direction: column;width: 100%;";
  }

  return "";
};

export const cssStyleElementTimelineHoziontalStyle3TabStylesOdd = ({
  v,
  device
}: CSSValue): string => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  if (isStyle3Horizontal(orientation, style)) {
    return "grid-row: 2/4;display: flex;";
  }

  return "";
};

export const cssStyleElementTimelineHoziontalStyle3TabStylesEven = ({
  v,
  device
}: CSSValue): string => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const orientation = dvv("verticalMode");
  const style = dvv("timelineStyle");

  if (isStyle3Horizontal(orientation, style)) {
    return "grid-row: 1/3;flex-direction: column-reverse; align-self:flex-end;";
  }

  return "";
};
