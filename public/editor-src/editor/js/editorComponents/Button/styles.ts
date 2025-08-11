import { isStory } from "visual/providers/EditorModeProvider";
import { isEditor } from "visual/providers/RenderProvider";
import { DeviceMode, DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle, Styles } from "visual/utils/cssStyle/types";
import { defaultValueValue } from "visual/utils/onChange";
import { getTooltipStyles } from "../tools/Tooltip/styles";
import { Value } from "./types";

interface BaseData extends DynamicStylesProps<Value> {
  hasSizing: boolean;
  device: DeviceMode;
}

export function style(data: BaseData): OutputStyle {
  const { hasSizing, device, ...baseData } = data;
  const { renderContext, mode } = data.contexts;
  const dvv = (key: string): unknown =>
    defaultValueValue({ v: baseData.v, key, device });

  const _isEditor = isEditor(renderContext);
  const _isStory = isStory(mode);
  const type = dvv("type");
  const submitType = type === "submit";

  const styles: Styles = {
    ".brz &&.brz-btn": {
      standart: [
        "cssStyleTypography2FontFamily",
        "cssStyleTypographyFontWeight",
        "cssStyleTypographyFontSize",
        "cssStyleTypographyLineHeight",
        "cssStyleTypographyLetterSpacing",
        "cssStyleTypography2FontVariation",
        "cssStyleTextTransforms",
        "cssStyleBorderRadiusType",
        "cssStyleElementButtonIconPosition",
        "cssStyleSizeHeightPxOnly",
        ...(_isStory
          ? ["cssStyleElementButtonSizeForStory"]
          : ["cssStylePaddingFourFields", "cssStyleElementButtonSize"]),
        "cssStyleSizeWidth"
      ]
    },
    ".brz &&.brz-btn:hover": {
      standart: [
        "cssStyleDisplayFlex",
        "cssStyleColor",
        ...(hasSizing && _isEditor && !submitType ? [] : ["cssStyleBorder"]),
        "cssStyleBoxShadow"
      ],
      interval: [
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
      standart: ["cssStyleCustomIconColor"]
    },
    ".brz &&.brz-btn.brz-btn-submit:hover": {
      standart: [
        "cssStyleColor",
        "cssStyleElementButtonBgColor",
        "cssStyleElementButtonBgGradient"
      ]
    },
    ".brz &&:after": {
      standart:
        (hasSizing && _isEditor) || submitType
          ? []
          : ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz && > .brz-ed-box__resizer": {
      standart: _isEditor
        ? ["cssStyleDisplayFlex", "cssStyleElementButtonIconPosition"]
        : []
    },
    ".brz && .brz-btn--story-container": {
      standart: [
        "cssStyleElementButtonBorderStory",
        "cssStyleElementButtonIconPosition",
        "cssStyleBorderRadiusType"
      ]
    },
    ".brz && .brz-btn--story-container:after": {
      standart: ["cssStyleSizeHeightPercentOnly"]
    },
    ".brz &&.brz-btn, .brz &&.brz-btn .brz-icon-svg-custom, .brz &&.brz-btn.brz-btn-submit":
      {
        standart: [
          "cssStyleHoverTransition",
          "cssStylePropertyHoverTransitionColor"
        ]
      }
  };

  return renderStyles({ ...baseData, styles });
}

export function styleIcon(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = {
    ".brz &&": {
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
        ]
      },
    ".brz &&.brz-btn--hover:not(.brz-btn--hover-in):before, .brz &&.brz-btn--hover-in":
      {
        standart: [
          "cssStyleElementButtonBgBlendColor",
          "cssStyleElementButtonBgBlendGradient"
        ]
      },
    ".brz &&.brz-back-pulse:before:hover": {
      interval: ["cssStyleButtonHoverAnimationDuration"]
    },
    ".brz &&.brz-btn--hover:not(.brz-btn--hover-in), .brz &&.brz-btn--hover-in:before, .brz &&.brz-btn--hover:not(.brz-btn--hover-in):before, .brz &&.brz-btn--hover-in":
      {
        standart: ["cssStyleButtonHoverTransitionDuration"]
      }
  };

  return renderStyles({ ...data, styles });
}

export function styleTooltip(data: DynamicStylesProps<Value>): OutputStyle {
  const styles = getTooltipStyles();
  return renderStyles({ ...data, styles });
}
