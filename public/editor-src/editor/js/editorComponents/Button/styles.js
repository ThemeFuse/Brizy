import { renderStyles } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";

export function style(v, vs, vd, hasSizing, device) {
  const dvv = (key) => defaultValueValue({ v, key, device });
  const type = dvv("type");

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
        ...(hasSizing && IS_EDITOR && type !== "submit"
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
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&.brz-btn.brz-btn-submit:hover": {
      standart: ["cssStyleColor", "cssStyleBgColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover:after": {
      standart:
        (hasSizing && IS_EDITOR) || type === "submit"
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
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
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
        "cssStyleElementButtonIconStrokeWidth"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
