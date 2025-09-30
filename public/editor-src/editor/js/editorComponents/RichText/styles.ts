import { ElementModel } from "visual/component/Elements/Types";
import { isStory } from "visual/providers/EditorModeProvider";
import { isEditor } from "visual/providers/RenderProvider";
import { DynamicStylesProps } from "visual/types";
import { renderStyles } from "visual/utils/cssStyle";
import { OutputStyle } from "visual/utils/cssStyle/types";
import { getTooltipStyles } from "../tools/Tooltip/styles";

export function style(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const styles = {
    ".brz &&": {
      standart: ["cssStyleSizeWidth", "cssStyleBlendMode"]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleDC(data: DynamicStylesProps<ElementModel>): OutputStyle {
  const _isStory = isStory(data.contexts.mode);

  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleElementRichTextAlign",
        "cssStyleElementRichTextFontFamily",
        ...(_isStory
          ? ["cssStyleElementRichTextFontSizeForStory"]
          : ["cssStyleTypography3FontSize"]),
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3TextTransform",
        "cssStyleElementRichTextDCUppercase"
      ]
    },
    ".brz && .brz-rich-text-context-wrapper, .brz && .brz-rich-text-context-wrapper :is(h1, h2, h3, h4, h5, h6)":
      {
        standart: [
          "cssStyleElementRichTextDCColor",
          "cssStyleElementRichTextDCGradient",
          "cssStyleElementTitleTextShadow",
          "cssStyleElementRichTextBgImage",
          "cssStyleTypography3Script"
        ]
      },
    ".brz &&.brz-rich-text__population .brz-rich-text-context-wrapper": {
      standart: ["cssStyleElementRichTextDCNumberOfLines"]
    },
    ".brz &&:hover .brz-rich-text-context-wrapper::before": {
      standart: [
        "cssStyleElementRichTextDCBackground",
        "cssStyleElementRichTextDCGradientBackground"
      ]
    },
    ".brz && *": {
      standart: ["cssStyleElementRichTextDCUppercase"]
    },
    ".brz &&:hover > .brz-a.brz-a:not(.brz-btn)": {
      standart: [
        "cssStyleColor",
        "cssStyleElementRichTextGradient",
        "cssStyleTextShadow"
      ]
    },
    ".brz && h1": {
      standart: [
        "cssStyleElementRichTextH1FontFamily",
        "cssStyleElementRichTextH1FontSize",
        "cssStyleElementRichTextH1LineHeight",
        "cssStyleElementRichTextH1FontWeight",
        "cssStyleElementRichTextH1LetterSpacing",
        "cssStyleElementRichTextH1FontVariation",
        "cssStyleElementRichTextH1TextTransform",
        "cssStyleElementRichTextH1Script"
      ]
    },
    ".brz && h2": {
      standart: [
        "cssStyleElementRichTextH2FontFamily",
        "cssStyleElementRichTextH2FontSize",
        "cssStyleElementRichTextH2LineHeight",
        "cssStyleElementRichTextH2FontWeight",
        "cssStyleElementRichTextH2LetterSpacing",
        "cssStyleElementRichTextH2FontVariation",
        "cssStyleElementRichTextH2TextTransform",
        "cssStyleElementRichTextH2Script"
      ]
    },
    ".brz && h3": {
      standart: [
        "cssStyleElementRichTextH3FontFamily",
        "cssStyleElementRichTextH3FontSize",
        "cssStyleElementRichTextH3LineHeight",
        "cssStyleElementRichTextH3FontWeight",
        "cssStyleElementRichTextH3LetterSpacing",
        "cssStyleElementRichTextH3FontVariation",
        "cssStyleElementRichTextH3TextTransform",
        "cssStyleElementRichTextH3Script"
      ]
    },
    ".brz && h4": {
      standart: [
        "cssStyleElementRichTextH4FontFamily",
        "cssStyleElementRichTextH4FontSize",
        "cssStyleElementRichTextH4LineHeight",
        "cssStyleElementRichTextH4FontWeight",
        "cssStyleElementRichTextH4LetterSpacing",
        "cssStyleElementRichTextH4FontVariation",
        "cssStyleElementRichTextH4TextTransform",
        "cssStyleElementRichTextH4Script"
      ]
    },
    ".brz && h5": {
      standart: [
        "cssStyleElementRichTextH5FontFamily",
        "cssStyleElementRichTextH5FontSize",
        "cssStyleElementRichTextH5LineHeight",
        "cssStyleElementRichTextH5FontWeight",
        "cssStyleElementRichTextH5LetterSpacing",
        "cssStyleElementRichTextH5FontVariation",
        "cssStyleElementRichTextH5TextTransform",
        "cssStyleElementRichTextH5Script"
      ]
    },
    ".brz && h6": {
      standart: [
        "cssStyleElementRichTextH6FontFamily",
        "cssStyleElementRichTextH6FontSize",
        "cssStyleElementRichTextH6LineHeight",
        "cssStyleElementRichTextH6FontWeight",
        "cssStyleElementRichTextH6LetterSpacing",
        "cssStyleElementRichTextH6FontVariation",
        "cssStyleElementRichTextH6TextTransform",
        "cssStyleElementRichTextH6Script"
      ]
    },
    ".brz && *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(b):not(strong):not(i):not(em):not(span):not(p):not(u)":
      {
        standart: [
          "cssStyleElementRichTextFontFamily",
          ...(_isStory
            ? ["cssStyleElementRichTextFontSizeForStory"]
            : ["cssStyleTypography3FontSize"]),
          "cssStyleTypography3LineHeight",
          "cssStyleTypography3FontWeight",
          "cssStyleTypography3LetterSpacing",
          "cssStyleTypography3FontVariation",
          "cssStyleTypography3TextTransform"
        ]
      },
    ".brz && strong, .brz && b, .brz && em, .brz && u": {
      standart: [
        "cssStyleElementRichTextFontFamily",
        ...(_isStory
          ? ["cssStyleElementRichTextFontSizeForStory"]
          : ["cssStyleTypography3FontSize"]),
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation"
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleHeading(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const { renderContext, mode } = data.contexts;

  const styles = {
    ".brz &&": {
      standart: [
        "cssStyleElementRichTextMarginTop",
        "cssStyleElementRichTextMarginBottom",
        "cssStyleElementRichTextAlign",
        "cssStyleElementRichTextFontFamily",
        ...(isStory(mode)
          ? ["cssStyleElementRichTextFontSizeForStory"]
          : ["cssStyleTypography3FontSize"]),
        "cssStyleTypography3LineHeight",
        "cssStyleTypography3FontWeight",
        "cssStyleTypography3LetterSpacing",
        "cssStyleTypography3FontVariation",
        "cssStyleTypography3TextTransform",
        "cssStyleTypography3Script"
      ]
    },
    ".brz &&:hover": {
      standart: [
        "cssStyleColor",
        ...(isEditor(renderContext) ? [] : ["cssStyleElementRichTextColor"])
      ]
    }
  };

  return renderStyles({ ...data, styles });
}

export function styleTooltip(
  data: DynamicStylesProps<ElementModel>
): OutputStyle {
  const styles = getTooltipStyles();
  return renderStyles({ ...data, styles });
}
