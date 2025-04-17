import { Num, Str } from "@brizy/readers";
import { ElementModel } from "visual/component/Elements/Types";
import { WithRenderContext, isEditor } from "visual/providers/RenderProvider";
import { getColor } from "visual/utils/color";
import {
  cssStyleTextScript,
  cssStyleTextTransforms,
  cssStyleTypography2FontFamily,
  cssStyleTypography2FontSize,
  cssStyleTypography2FontVariation,
  cssStyleTypography2FontWeight,
  cssStyleTypography2LetterSpacing,
  cssStyleTypography2LineHeight
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { readToggle } from "visual/utils/options/ToggleButton/utils";
import { read as readNum } from "visual/utils/reader/number";
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
import { isNullish } from "visual/utils/value";
import { styleState, styleTypography2FontSize } from "../style2";
import { CSSValue } from "../style2/types";
import { cssStyleColor } from "./cssStyleColor";

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
  store,
  getConfig,
  state
}: CSSValue): string {
  if (v.colorType !== "gradient") {
    return "";
  }

  const bgGradient = styleElementRichTextGradient({
    v,
    store,
    getConfig,
    device,
    state
  });

  const styles = [
    `background-image:${bgGradient}`,
    "background-clip: text",
    "-webkit-background-clip: text",
    "color: transparent !important"
  ];

  return styles.join(";") + ";";
}

export function cssStyleElementRichTextFontSizeForStory(d: CSSValue): string {
  const { v, device, state } = d;
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const fontStyle = dvv("typographyFontStyle");
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

export function cssStyleElementRichTextBgImage({
  v,
  device,
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  const bgImage = isEditor(renderContext)
    ? styleBgImage({ v, device, state, getConfig, store })
    : styleExportBgImage({ v, device, state, getConfig, store });

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
  state,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  const family = styleTypography2FontFamily({
    v,
    device,
    prefix,
    state,
    store,
    getConfig,
    renderContext
  });

  return family ? `font-family:${family} !important;` : "";
}

const getState = (v: ElementModel, state: State): string =>
  //@ts-expect-error: v as any
  styleState({ v, state }) === "hover" ? "hover" : state;

export function cssStyleElementRichTextColor({
  v,
  device,
  getConfig,
  state
}: CSSValue): string {
  const _state = getState(v, state);
  const dvv = (key: string): string =>
    defaultValueValue({ v, key, device, state: _state });

  const colorHex = Str.read(dvv(capByPrefix("color", "hex")));
  const colorPalette = Str.read(dvv("block-colorPalette"));
  const colorOpacity = Num.read(dvv(capByPrefix("color", "opacity")));

  if (
    isNullish(colorHex) ||
    isNullish(colorPalette) ||
    isNullish(colorOpacity)
  ) {
    return "";
  }

  const config = getConfig();
  const color = getColor(colorPalette, colorHex, colorOpacity, config);

  return `color:${color};`;
}

export function cssStyleElementRichTextDCColor({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "bgColor"
  });
}

export function cssStyleElementRichTextDCBackground({
  v,
  device,
  state,
  getConfig
}: CSSValue): string {
  const background = styleColor({
    v,
    device,
    state,
    getConfig,
    prefix: "textBgColor"
  });

  return background === undefined ? "" : `background-color:${background};`;
}

export function cssStyleElementRichTextDCGradient({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  if (v.bgColorType !== "gradient") {
    return "";
  }

  const dcGradient = styleElementRichTextDCGradient({
    v,
    device,
    state,
    getConfig,
    store
  });

  const styles = [
    `background-image: ${dcGradient}`,
    "background-clip: text",
    "-webkit-background-clip: text",
    "-webkit-text-fill-color: transparent",
    "color: transparent !important"
  ];

  return styles.join(";") + ";";
}

export function cssStyleElementRichTextDCGradientBackground({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string {
  if (v.textBgColorType !== "gradient") {
    return "";
  }

  const dcGradient = styleElementRichTextDCGradientBackground({
    v,
    device,
    state,
    getConfig,
    store
  });

  return `background-image: ${dcGradient};`;
}

export function cssStyleElementRichTextH1FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "h1",
    renderContext
  });
}

export function cssStyleElementRichTextH1FontSize({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h1"
  });
}

export function cssStyleElementRichTextH1LineHeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h1"
  });
}

export function cssStyleElementRichTextH1FontWeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h1"
  });
}

export function cssStyleElementRichTextH1LetterSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h1"
  });
}

export function cssStyleElementRichTextH1FontVariation({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "h1"
  });
}

export function cssStyleElementRichTextH1TextTransform({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h1"
  });
}

export function cssStyleElementRichTextH1Script({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextScript({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h1"
  });
}

export function cssStyleElementRichTextH2FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "h2",
    renderContext
  });
}

export function cssStyleElementRichTextH2FontSize({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h2"
  });
}

export function cssStyleElementRichTextH2LineHeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h2"
  });
}

export function cssStyleElementRichTextH2FontWeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h2"
  });
}

export function cssStyleElementRichTextH2LetterSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h2"
  });
}

export function cssStyleElementRichTextH2FontVariation({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "h2"
  });
}

export function cssStyleElementRichTextH2TextTransform({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h2"
  });
}

export function cssStyleElementRichTextH2Script({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextScript({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h2"
  });
}

export function cssStyleElementRichTextH3FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "h3",
    renderContext
  });
}

export function cssStyleElementRichTextH3FontSize({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h3"
  });
}

export function cssStyleElementRichTextH3LineHeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h3"
  });
}

export function cssStyleElementRichTextH3FontWeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h3"
  });
}

export function cssStyleElementRichTextH3LetterSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h3"
  });
}

export function cssStyleElementRichTextH3FontVariation({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "h3"
  });
}

export function cssStyleElementRichTextH3TextTransform({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h3"
  });
}

export function cssStyleElementRichTextH3Script({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextScript({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h3"
  });
}

export function cssStyleElementRichTextH4FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "h4",
    renderContext
  });
}

export function cssStyleElementRichTextH4FontSize({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h4"
  });
}

export function cssStyleElementRichTextH4LineHeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h4"
  });
}

export function cssStyleElementRichTextH4FontWeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h4"
  });
}

export function cssStyleElementRichTextH4LetterSpacing({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h4"
  });
}

export function cssStyleElementRichTextH4FontVariation({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "h4"
  });
}

export function cssStyleElementRichTextH4TextTransform({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h4"
  });
}

export function cssStyleElementRichTextH4Script({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextScript({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h4"
  });
}

export function cssStyleElementRichTextH5FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "h5",
    renderContext
  });
}

export function cssStyleElementRichTextH5FontSize({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h5"
  });
}

export function cssStyleElementRichTextH5LineHeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h5"
  });
}

export function cssStyleElementRichTextH5FontWeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h5"
  });
}

export function cssStyleElementRichTextH5LetterSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h5"
  });
}

export function cssStyleElementRichTextH5FontVariation({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "h5"
  });
}

export function cssStyleElementRichTextH5TextTransform({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h5"
  });
}

export function cssStyleElementRichTextH5Script({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextScript({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h5"
  });
}

export function cssStyleElementRichTextH6FontFamily({
  v,
  device,
  store,
  getConfig,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    getConfig,
    prefix: "h6",
    renderContext
  });
}

export function cssStyleElementRichTextH6FontSize({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({
    v,
    device,
    store,
    getConfig,
    prefix: "h6"
  });
}

export function cssStyleElementRichTextH6LineHeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h6"
  });
}

export function cssStyleElementRichTextH6FontWeight({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({
    v,
    device,
    store,
    getConfig,
    prefix: "h6"
  });
}

export function cssStyleElementRichTextH6LetterSpacing({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h6"
  });
}

export function cssStyleElementRichTextH6FontVariation({
  v,
  device,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({
    v,
    device,
    store,
    getConfig,
    prefix: "h6"
  });
}

export function cssStyleElementRichTextH6TextTransform({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h6"
  });
}

export function cssStyleElementRichTextH6Script({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  return cssStyleTextScript({
    v,
    device,
    state,
    store,
    getConfig,
    prefix: "h6"
  });
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
  store,
  getConfig,
  prefix = "content"
}: CSSValue): string {
  const align = styleAlignHorizontal({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });

  return align ? `text-align:${align}!important;` : "";
}
