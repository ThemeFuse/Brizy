import { isEditor } from "visual/providers/RenderProvider";
import { DeviceMode, DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types";

interface BaseData extends DynamicStylesProps<Value> {
  hasSizing: boolean;
  device: DeviceMode;
}

export function style(data: BaseData): OutputStyle {
  const { hasSizing, device, ...baseData } = data;
  const { renderContext } = baseData;
  const dvv = (key: string): unknown =>
    defaultValueValue({ v: baseData.v, key, device });

  const _isEditor = isEditor(renderContext);
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
        ...(hasSizing && _isEditor && !submitType ? [] : ["cssStyleBorder"]),
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
        (hasSizing && _isEditor) || submitType
          ? []
          : ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&:hover > .brz-ed-box__resizer": {
      standart: _isEditor
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

  return renderStyles({ ...baseData, styles });
}

export function styleIcon(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&:hover": {
      standart: [
        "cssStyleSizeFontSizeIcon",
        "cssStyleElementButtonIconMargin",
        "cssStyleElementButtonIconStrokeWidth"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleButtonFillAnimation(
  data: DynamicStylesProps<Value>
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

  return renderStyles({ ...data, styles });
}
