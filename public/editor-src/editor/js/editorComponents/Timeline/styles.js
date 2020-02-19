import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz && .brz-timeline__nav--title": {
      standart: [
        "cssStyleLabelColor",
        "cssStyleElementTimelineNavTitleVisible",
        "cssStyleElementTimelineNavTitleWidth",
        "cssStyleTypography3FontFamily",
        "cssStyleTypography3FontSize",
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing"
      ]
    },
    ".brz && .brz-timeline__nav--icon": {
      standart: [
        "cssStyleElementTimelineIconSize",
        "cssStyleBorder",
        "cssStyleElementTimelinePaddingForIcon",
        "cssStyleElementTimelineIconBorderRadius",
        "cssStyleElementTimelineIconWidth",
        "cssStyleElementTimelineIconHeight"
      ]
    },
    ".brz && .brz-timeline__content": {
      standart: [
        "cssStylePaddingFourFields",
        "cssStyleMargin",
        "cssStyleBorder"
      ]
    },
    ".brz && .brz-timeline__content:before": {
      standart: [
        "cssStyleElementTimelineArrowBorder",
        "cssStyleElementTimelineArrowBorderLeftColor",
        "cssStyleElementTimelineArrowBorderTopColor"
      ]
    },

    // Horizontal Style-1
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab": {
      standart: ["cssStyleElementTimelineCustomTabWidth"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab:after": {
      standart: [
        "cssStyleElementTimelineAfterLineHeight",
        "cssStyleElementTimelineLineWidth",
        "cssStyleElementTimelineLineLeftPosition"
      ]
    },
    ".brz && .brz-timeline__tab:after, .brz-timeline__tab:before": {
      standart: ["cssStyleElementTimelineLineBgColor"]
    },
    ".brz && .brz-timeline__tabs--horizontal .brz-timeline__content": {
      standart: ["cssStyleElementTimelineContentSpacing"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab .brz-timeline__content:before": {
      standart: ["cssStyleElementTimelineArrowPosition"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-1:after": {
      standart: ["cssStyleElementTimelineLineTop"]
    },

    // Horizontal Style-2
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tabs--style-2": {
      standart: ["cssStyleDisplayFlex"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-2:after": {
      standart: ["cssStyleElementTimelineTopLinePosition"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-2 .brz-timeline__content": {
      standart: ["cssStyleElementTimelineTopContentSpacing"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-2 .brz-timeline__content:before": {
      standart: [
        "cssStyleElementTimelineTopTabsArrowBorder",
        "cssStyleElementTimelineArrowBorderBottomColor",
        "cssStyleElementTimelineArrowBorderRightColor"
      ]
    },

    // Horizontal Style-3
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-3:after": {
      standart: ["cssStyleElementTimelineLineTop"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-3:nth-child(odd)": {
      standart: ["cssStyleElementTimelineCustomPosition"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-3:nth-child(even) .brz-timeline__content": {
      standart: ["cssStyleElementTimelineCustomContentTopSpacing"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-3:nth-child(odd) .brz-timeline__content": {
      standart: ["cssStyleElementTimelineCustomContentBottomSpacing"]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-3:nth-child(even) .brz-timeline__content:before": {
      standart: [
        "cssStyleElementTimelineCustomArrowBorder",
        "cssStyleElementTimelineArrowBorderBottomColor",
        "cssStyleElementTimelineArrowBorderRightColor"
      ]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tab--style-3:nth-child(even):after": {
      standart: ["cssStyleElementTimelineCustomLineTop"]
    },

    // Vertical Style-1
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab:after": {
      standart: [
        "cssStyleElementTimelineVerticalLineHeight",
        "cssStyleElementTimelineVerticalLineWidth",
        "cssStyleElementTimelineVerticalLineTopPosition"
      ]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab:before": {
      standart: [
        "cssStyleElementTimelineVerticalLineHeight",
        "cssStyleElementTimelineVerticalLineWidth",
        "cssStyleElementTimelineVerticalLineBottomPosition"
      ]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-1 ": {
      standart: ["cssStyleElementTimelineVerticalPosition"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-1:after": {
      standart: ["cssStyleElementTimelineVerticalLinePosition"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-1:before": {
      standart: ["cssStyleElementTimelineVerticalLinePosition"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab .brz-timeline__content": {
      standart: [
        "cssStyleElementTimelineVerticalSpacing",
        "cssStyleElementTimelineWidth"
      ]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab .brz-timeline__content:before": {
      standart: [
        "cssStyleElementTimelineVerticalArrowBorder",
        "cssStyleElementTimelineVerticalArrowPosition"
      ]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-1 .brz-timeline__content:before": {
      standart: [
        "cssStyleElementTimelineArrowBorderBottomColor",
        "cssStyleElementTimelineArrowBorderLeftColor"
      ]
    },

    // Vertical Style-2
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-2": {
      standart: ["cssStyleElementTimelineVerticalInvertPosition"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-2:after": {
      standart: [
        "cssStyleElementTimelineVerticalLineTopPosition",
        "cssStyleElementTimelineVerticalInvertLinePosition"
      ]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-2:before": {
      standart: [
        "cssStyleElementTimelineVerticalLineBottomPosition",
        "cssStyleElementTimelineVerticalInvertLinePosition"
      ]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-2 .brz-timeline__content": {
      standart: ["cssStyleElementTimelineVerticalInvertSpacing"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-2 .brz-timeline__content:before": {
      standart: [
        "cssStyleElementTimelineVerticalInvertArrowBorder",
        "cssStyleElementTimelineArrowBorderRightColor",
        "cssStyleElementTimelineArrowBorderTopColor",
        "cssStyleElementTimelineVerticalInvertArrowPosition"
      ]
    },

    // Vertical Style-3
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-3:nth-child(odd)": {
      standart: ["cssStyleElementTimelineVerticalCustomTabPositionOdd"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-3:nth-child(even)": {
      standart: ["cssStyleElementTimelineVerticalCustomTabPosition"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-3:nth-child(even):before": {
      standart: ["cssStyleElementTimelineVerticalCustomPosition"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-3:nth-child(even):after": {
      standart: ["cssStyleElementTimelineVerticalCustomPosition"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-3:nth-child(odd):before": {
      standart: ["cssStyleElementTimelineVerticalLinePosition"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-3:nth-child(odd):after": {
      standart: ["cssStyleElementTimelineVerticalLinePosition"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-3:nth-child(even) .brz-timeline__content": {
      standart: ["cssStyleElementTimelineVerticalCustomContentSpacing"]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-3:nth-child(even) .brz-timeline__content:before": {
      standart: [
        "cssStyleElementTimelineVerticalInvertArrowBorder",
        "cssStyleElementTimelineArrowBorderRightColor",
        "cssStyleElementTimelineArrowBorderTopColor",
        "cssStyleElementTimelineVerticalCustomArrowPosition"
      ]
    },
    ".brz && .brz-timeline__tabs--vertical.brz-timeline__tab--style-3:nth-child(odd) .brz-timeline__content:before": {
      standart: [
        "cssStyleElementTimelineArrowBorderBottomColor",
        "cssStyleElementTimelineArrowBorderLeftColor"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
