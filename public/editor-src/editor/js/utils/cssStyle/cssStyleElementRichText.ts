import { ElementModel } from "visual/component/Elements/Types";
import Config from "visual/global/Config";
import { hexToRgba } from "visual/utils/color";
import {
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight,
  cssStyleTextScript
} from "visual/utils/cssStyle";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { read as readNum } from "visual/utils/reader/number";
import { readToggle } from "visual/utils/options/ToggleButton/utils";
import { State } from "visual/utils/stateMode";
import { capByPrefix } from "visual/utils/string";
import {
  styleAlignHorizontal,
  styleBgImage,
  styleColor,
  styleExportBgImage,
  styleTypography2FontFamily,
  styleTypography2FontSizeSuffix
} from "visual/utils/style2";
import {
  styleElementRichTextDCGradient,
  styleElementRichTextDCGradientBackground,
  styleElementRichTextGradient
} from "visual/utils/style2/styleElementRichText";
import { styleState, styleTypography2FontSize } from "../style2";
import { CSSValue } from "../style2/types";
import { cssStyleColor } from "./cssStyleColor";
import { cssStyleTypography3FontSize } from "./cssStyleTypography2";

export function cssStyleElementRichTextMarginTop({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const marginTop = dvv("marginTop");

  return marginTop === undefined ? "" : `margin-top:${marginTop}px !important;`;
}

export function cssStyleElementRichTextMarginBottom({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const marginBottom = dvv("marginBottom");

  return marginBottom === undefined
    ? ""
    : `margin-bottom:${marginBottom}px !important;`;
}

export function cssStyleElementRichTextGradient({
  v,
  device,
  state
}: CSSValue): string {
  const bgGradient = styleElementRichTextGradient({
    v,
    device,
    state
  });

  const styles = [
    `background-image:${bgGradient}`,
    "background-clip: text",
    "-webkit-background-clip: text",
    "color: transparent !important"
  ];

  return v.colorType === "gradient" ? styles.join(";") + ";" : "";
}

export function cssStyleElementRichTextFontSize(d: CSSValue): string {
  const { v, device, state } = d;
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const fontStyle = dvv("typographyFontStyle");
  if (isStory(Config.getAll())) {
    if (fontStyle) {
      // Keys is lowercase because have problems in backend export HTML
      return `font-size:var(--brz-${fontStyle}StoryFontSize);`.toLowerCase();
    } else {
      const fontSize =
        readNum(
          styleTypography2FontSize({
            ...d,
            prefix: "typography"
          })
        ) ?? 1;
      const suffix = styleTypography2FontSizeSuffix({
        ...d,
        prefix: "typography"
      });

      const pixelSuffix = suffix === "px" ? 1 : 0.23;

      return `font-size:${fontSize * pixelSuffix}${suffix};`;
    }
  }

  return cssStyleTypography3FontSize(d);
}

export function cssStyleElementRichTextBgImage({
  v,
  device,
  state
}: CSSValue): string {
  const bgImage = IS_EDITOR
    ? styleBgImage({ v, device, state })
    : styleExportBgImage({ v, device, state });

  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const x = dvv("bgPositionX");
  const y = dvv("bgPositionY");

  const styles = {
    "background-clip": "text",
    "-webkit-background-clip": "text",
    color: "transparent!important",
    "caret-color": "#000",
    "background-position": `${x}% ${y}%`,
    "background-image": bgImage
  };

  return bgImage === "none"
    ? ""
    : Object.entries(styles)
        .map(([k, v]) => `${k}: ${v}`)
        .join(";") + ";";
}

export function cssStyleElementRichTextFontFamily({
  v,
  device,
  prefix = "typography",
  state
}: CSSValue): string {
  const family = styleTypography2FontFamily({
    v,
    device,
    prefix,
    state
  });

  return family ? `font-family:${family} !important;` : "";
}

const getState = (v: ElementModel, state: State): string =>
  //@ts-expect-error: v as any
  styleState({ v, state }) === "hover" ? "hover" : state;

export function cssStyleElementRichTextColor({
  v,
  device,
  state
}: CSSValue): string {
  const _state = getState(v, state);
  const dvv = (key: string): string =>
    defaultValueValue({ v, key, device, state: _state });

  const { hex } = getOptionColorHexByPalette(
    dvv(capByPrefix("color", "hex")),
    dvv("block-colorPalette")
  );

  const rgb = hexToRgba(hex, dvv(capByPrefix("color", "opacity"))) ?? "";

  return rgb === undefined ? "" : `color:${rgb};`;
}

export function cssStyleElementRichTextDCColor({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleColor({ v, device, state, prefix: "bgColor" });
}

export function cssStyleElementRichTextDCBackground({
  v,
  device,
  state
}: CSSValue): string {
  const background = styleColor({ v, device, state, prefix: "textBgColor" });

  return background === undefined ? "" : `background-color:${background};`;
}

export function cssStyleElementRichTextDCGradient({
  v,
  device,
  state
}: CSSValue): string {
  const dcGradient = styleElementRichTextDCGradient({
    v,
    device,
    state
  });

  const styles = [
    `background-image: ${dcGradient}`,
    "background-clip: text",
    "-webkit-background-clip: text",
    "-webkit-text-fill-color: transparent",
    "color: transparent !important"
  ];

  return v.bgColorType === "gradient" ? styles.join(";") + ";" : "";
}

export function cssStyleElementRichTextDCGradientBackground({
  v,
  device,
  state
}: CSSValue): string {
  const dcGradient = styleElementRichTextDCGradientBackground({
    v,
    device,
    state
  });

  return v.textBgColorType === "gradient"
    ? `background-image: ${dcGradient};`
    : "";
}

export function cssStyleElementRichTextH1FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "h1" });
}

export function cssStyleElementRichTextH1FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "h1" });
}

export function cssStyleElementRichTextH1LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "h1" });
}

export function cssStyleElementRichTextH1FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "h1" });
}

export function cssStyleElementRichTextH1LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "h1" });
}

export function cssStyleElementRichTextH1FontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "h1" });
}

export function cssStyleElementRichTextH1TextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, prefix: "h1" });
}

export function cssStyleElementRichTextH1Script({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, prefix: "h1" });
}

export function cssStyleElementRichTextH2FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "h2" });
}

export function cssStyleElementRichTextH2FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "h2" });
}

export function cssStyleElementRichTextH2LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "h2" });
}

export function cssStyleElementRichTextH2FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "h2" });
}

export function cssStyleElementRichTextH2LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "h2" });
}

export function cssStyleElementRichTextH2FontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "h2" });
}

export function cssStyleElementRichTextH2TextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, prefix: "h2" });
}

export function cssStyleElementRichTextH2Script({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, prefix: "h2" });
}

export function cssStyleElementRichTextH3FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "h3" });
}

export function cssStyleElementRichTextH3FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "h3" });
}

export function cssStyleElementRichTextH3LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "h3" });
}

export function cssStyleElementRichTextH3FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "h3" });
}

export function cssStyleElementRichTextH3LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "h3" });
}

export function cssStyleElementRichTextH3FontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "h3" });
}

export function cssStyleElementRichTextH3TextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, prefix: "h3" });
}

export function cssStyleElementRichTextH3Script({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, prefix: "h3" });
}

export function cssStyleElementRichTextH4FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "h4" });
}

export function cssStyleElementRichTextH4FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "h4" });
}

export function cssStyleElementRichTextH4LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "h4" });
}

export function cssStyleElementRichTextH4FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "h4" });
}

export function cssStyleElementRichTextH4LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "h4" });
}

export function cssStyleElementRichTextH4FontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "h4" });
}

export function cssStyleElementRichTextH4TextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, prefix: "h4" });
}

export function cssStyleElementRichTextH4Script({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, prefix: "h4" });
}

export function cssStyleElementRichTextH5FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "h5" });
}

export function cssStyleElementRichTextH5FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "h5" });
}

export function cssStyleElementRichTextH5LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "h5" });
}

export function cssStyleElementRichTextH5FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "h5" });
}

export function cssStyleElementRichTextH5LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "h5" });
}

export function cssStyleElementRichTextH5FontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "h5" });
}

export function cssStyleElementRichTextH5TextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, prefix: "h5" });
}

export function cssStyleElementRichTextH5Script({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, prefix: "h5" });
}

export function cssStyleElementRichTextH6FontFamily({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontFamily({ v, device, prefix: "h6" });
}

export function cssStyleElementRichTextH6FontSize({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, prefix: "h6" });
}

export function cssStyleElementRichTextH6LineHeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, prefix: "h6" });
}

export function cssStyleElementRichTextH6FontWeight({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, prefix: "h6" });
}

export function cssStyleElementRichTextH6LetterSpacing({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({ v, device, state, prefix: "h6" });
}

export function cssStyleElementRichTextH6FontVariation({
  v,
  device
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, prefix: "h6" });
}

export function cssStyleElementRichTextH6TextTransform({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, prefix: "h6" });
}

export function cssStyleElementRichTextH6Script({
  v,
  device,
  state
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, prefix: "h6" });
}

export function cssStyleElementRichTextDCUppercase({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const capitalize = dvv("dynamicTextCapitalize");

  return readToggle(capitalize) ? `text-transform : uppercase !important;` : "";
}

export function cssStyleElementRichTextAlign({
  v,
  device,
  state,
  prefix = "content"
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, prefix });

  return align ? `text-align:${align}!important;` : "";
}
