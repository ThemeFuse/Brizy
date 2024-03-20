import { DeviceMode } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types";

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
        "cssStyleColor",
        ...(hasSizing && IS_EDITOR && !submitType ? [] : ["cssStyleBorder"]),
        "cssStyleBorderRadiusType",
        "cssStyleElementButtonBgColor",
        "cssStyleElementButtonBgGradient",
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
