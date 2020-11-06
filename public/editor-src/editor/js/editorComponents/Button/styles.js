import { renderStyles } from "visual/utils/cssStyle";

export function style(v, vs, vd, hasSizing) {
  const styles = {
    ".brz &&.brz-btn:hover": {
      standart: [
        "cssStyleDisplayFlex",
        ...(IS_PREVIEW ? ["cssStyleElementButtonPropertyContentAlign"] : []),
        "cssStyleTypographyFontFamily",
        "cssStyleTypographyFontWeight",
        "cssStyleTypographyFontSize",
        "cssStyleTypographyLineHeight",
        "cssStyleTypographyLetterSpacing",
        "cssStyleColor",
        ...(hasSizing && IS_EDITOR && v.type !== "submit"
          ? []
          : ["cssStyleBorder"]),
        "cssStyleElementButtonBorderRadius",
        "cssStyleBgColor",
        "cssStyleBgGradient",
        "cssStyleBoxShadow",
        "cssStylePaddingFourFields",
        "cssStyleElementButtonIconPosition",
        "cssStyleSizeWidth",
        "cssStyleSizeHeightPxOnly"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStyleElementButtonPropertyHoverTransition"
      ]
    },
    ".brz &&:hover:after": {
      standart:
        (hasSizing && IS_EDITOR) || v.type === "submit"
          ? []
          : ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:hover > .brz-ed-box__resizer": {
      standart: IS_EDITOR
        ? [
            "cssStyleDisplayFlex",
            "cssStyleElementButtonIconPosition",
            "cssStyleElementButtonPropertyContentAlign"
          ]
        : []
    },
    ".brz &&:hover .brz-btn--story-container": {
      standart: [
        "cssStyleBorder",
        "cssStyleElementButtonIconPosition",
        "cssStyleElementButtonBorderRadius"
      ]
    },
    ".brz &&:hover .brz-btn--story-container:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleIcon(v, vs, vd) {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleElementButtonIconFontSize",
        "cssStyleElementButtonIconMargin",
        "cssStyleElementIconStrokeWidth"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
