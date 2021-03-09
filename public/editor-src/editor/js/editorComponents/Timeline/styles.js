import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd) {
  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleElementTimelineTabs",
        "cssStyleElementTimelineTabsHorizontalStyle3"
      ]
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
        "cssStyleTypography3LetterSpacing",
        "cssStyleElementTimelineNavTitle"
      ]
    },
    ".brz && .brz-timeline__nav--icon": {
      standart: [
        "cssStyleElementTimelineIconSize",
        "cssStyleBorder",
        "cssStyleElementTimelinePaddingForIcon",
        "cssStyleElementTimelineIconBorderRadius",
        "cssStyleElementTimelineIconWidth",
        "cssStyleElementTimelineIconHeight",
        "cssStyleElementTimelineTabsVerticalNavIcon"
      ]
    },
    ".brz && .brz-timeline__content": {
      standart: [
        "cssStylePaddingFourFields",
        "cssStyleMargin",
        "cssStyleBorder",
        "cssStyleElementTimelineWidth",
        "cssStyleElementTimelineTabsVerticalContent"
      ]
    },

    // Horizontal Style-1
    ".brz && .brz-timeline__tab": {
      standart: [
        "cssStyleElementTimelineTab",
        "cssStyleElementTimelineVerticalTab",
        "cssStyleElementTimelineCustomTabWidth",
        "cssStyleElementTimelineVerticalPosition"
      ]
    },
    ".brz && .brz-timeline__tab:nth-child(odd)": {
      standart: [
        "cssStyleElementTimelineVerticalCustomTabPositionOdd",
        "cssStyleElementTimelineTabHorizontalStyle3Odd"
      ]
    },
    ".brz && .brz-timeline__tab:nth-child(even)": {
      standart: [
        "cssStyleElementTimelineTabCustomStyle",
        "cssStyleElementTimelineVerticalCustomTabPosition"
      ]
    },
    ".brz && .brz-timeline__tab:last-child": {
      standart: ["cssStyleElementTimelineVerticalLastTab"]
    },
    ".brz && .brz-timeline__tab:after": {
      standart: [
        "cssStyleElementTimelineLineTop",
        "cssStyleElementTimelineLineWidthHeightAfter"
      ]
    },
    ".brz && .brz-timeline__tab:nth-child(even):after": {
      standart: [
        "cssStyleElementTimelineCustomLineTop",
        "cssStyleElementTimelineVerticalCustomPosition"
      ]
    },
    ".brz && .brz-timeline__tab:nth-child(odd):after": {
      standart: ["cssStyleElementTimelineCustomLineOdd"]
    },
    ".brz && .brz-timeline__tab:before": {
      standart: [
        "cssStyleElementTimelineBeforeDisplay",
        "cssStyleElementTimelineLineWidthHeightBefore",
        "cssStyleElementTimelineVerticalLinePosition"
      ]
    },
    ".brz && .brz-timeline__tab:nth-child(even):before": {
      standart: ["cssStyleElementTimelineVerticalCustomPosition"]
    },
    ".brz && .brz-timeline__tab:after, .brz-timeline__tab:before": {
      standart: ["cssStyleElementTimelineLineBgColor"]
    },
    ".brz && .brz-timeline__tab .brz-timeline__content": {
      standart: [
        "cssStyleElementTimelineContentSpacing",
        "cssStyleElementTimelineWidth"
      ]
    },
    ".brz && .brz-timeline__tab:nth-child(even) .brz-timeline__content": {
      standart: ["cssStyleElementTimelineCustomContentSpacing"]
    },
    ".brz && .brz-timeline__tab .brz-timeline__content:before": {
      interval: [
        "cssStyleElementTimelineTabContentBefore",
        "cssStyleElementTimelineTabContentArrowColor"
      ]
    },
    ".brz && .brz-timeline__tab:nth-child(even) > .brz-timeline__content:before": {
      interval: [
        "cssStyleElementTimelineVerticalStyle3ArrowPosition",
        "cssStyleElementTimelineTabContentArrowCustomColor"
      ]
    },
    ".brz && .brz-timeline__tab:nth-child(odd) > .brz-timeline__content:before": {
      interval: [
        "cssStyleElementTimelineContentBeforeStyle3",
        "cssStyleElementTimelineTabContentArrowCustomColor1"
      ]
    },
    ".brz && .brz-timeline__tabs--horizontal.brz-timeline__tabs--style-2": {
      standart: ["cssStyleDisplayFlex"]
    },

    ".brz && .brz-timeline__tab:first-child:before": {
      standart: ["cssStyleElementTimelineVerticalTabBeforeNone"]
    },
    ".brz && .brz-timeline__tab:nth-child(even):last-child:after": {
      standart: ["cssStyleElementTimelineVerticalTabBeforeStyle3"]
    },

    ".brz && .brz-timeline__tab:nth-child(even) > .brz-timeline__nav--title": {
      standart: ["cssStyleElementTimelineNavTitleStyle3"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
