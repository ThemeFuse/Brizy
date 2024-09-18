import { DeviceMode } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";

export function style(
  v: Value,
  vs: Value,
  vd: Value,
  hasSizing: boolean,
  device: DeviceMode
): [string, string, string] {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const type = dvv("type");
  const submitType = type === "submit";

  const styles = {
    ".brz &&.brz-btn:hover": {
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleTypography2FontFamily",
        "cssStyleTypographyFontWeight",
        "cssStyleTypographyFontSize",
        "cssStyleTypographyLineHeight",
        "cssStyleTypographyLetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleColor",
        ...(hasSizing && IS_EDITOR && !submitType ? [] : ["cssStyleBorder"]),
        "cssStyleBorderRadiusType",
        "cssStyleBoxShadow",
        "cssStylePaddingFourFields",
        "cssStyleElementButtonIconPosition",
        "cssStyleSizeWidth",
        "cssStyleSizeHeightPxOnly",
        "cssStyleElementButtonSize"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor",
        "cssStyleVisibleMode|||editor",
        "cssStyleVisibleMode|||preview",
        "cssStyleVisibleEditorDisplayNoneOrFlex|||editor"
      ]
    },
    ".brz &&.brz-btn:not(.brz-btn--hover):hover": {
      standart: [
        "cssStyleElementButtonBgColor",
        "cssStyleElementButtonBgGradient"
      ]
    },
    ".brz &&.brz-btn:hover .brz-icon-svg-custom": {
      standart: ["cssStyleCustomIconColor"],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&.brz-btn.brz-btn-submit:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleElementButtonBgColor",
        "cssStyleElementButtonBgGradient"
      ],
      interval: [
        "cssStyleHoverTransition",
        "cssStylePropertyHoverTransitionColor"
      ]
    },
    ".brz &&:hover:after": {
      standart:
        (hasSizing && IS_EDITOR) || submitType
          ? []
          : ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:hover > .brz-ed-box__resizer": {
      standart: IS_EDITOR
        ? ["cssStyleDisplayFlex", "cssStyleElementButtonIconPosition"]
        : []
    },
    ".brz &&:hover .brz-btn--story-container": {
      standart: [
        "cssStyleElementButtonBorderStory",
        "cssStyleElementButtonIconPosition",
        "cssStyleBorderRadiusType"
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

export function styleIcon(
  v: Value,
  vs: Value,
  vd: Value
): [string, string, string] {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleSizeFontSizeIcon",
        "cssStyleElementButtonIconMargin",
        "cssStyleElementButtonIconStrokeWidth"
      ]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}

export function styleButtonFillAnimation(
  v: Value,
  vs: Value,
  vd: Value
): OutputStyle {
  const styles: Styles = {
    ".brz &&.brz-btn--hover:not(.brz-btn--hover-in), .brz &&.brz-btn--hover-in:before":
      {
        standart: [
          "cssStyleElementButtonBgColorStateNORMAL",
          "cssStyleElementButtonBgGradientStateNORMAL"
        ],
        interval: ["cssStyleButtonHoverTransitionDuration"]
      },
    ".brz &&.brz-btn--hover:not(.brz-btn--hover-in):before, .brz &&.brz-btn--hover-in":
      {
        standart: [
          "cssStyleElementButtonBgBlendColor",
          "cssStyleElementButtonBgBlendGradient"
        ],
        interval: ["cssStyleButtonHoverTransitionDuration"]
      },
    ".brz &&.brz-back-pulse:before:hover": {
      interval: ["cssStyleButtonHoverAnimationDuration"]
    }
  };

  return renderStyles({ v, vs, vd, styles });
}
