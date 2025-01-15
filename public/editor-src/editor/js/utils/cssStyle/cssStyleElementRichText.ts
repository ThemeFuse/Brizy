import { Num, Str } from "@brizy/readers";
import { ElementModel } from "visual/component/Elements/Types";
import Config from "visual/global/Config";
import {
  WithRenderContext,
  isEditor
} from "visual/providers/RenderProvider";
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
import { isStory } from "visual/utils/models";
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
  store,
  state
}: CSSValue): string {
  if (v.colorType !== "gradient") {
    return "";
  }

  const bgGradient = styleElementRichTextGradient({
    v,
    store,
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
  state,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  const bgImage = isEditor(renderContext)
    ? styleBgImage({ v, device, state, store })
    : styleExportBgImage({ v, device, state, store });

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
  renderContext
}: CSSValue & WithRenderContext): string {
  const family = styleTypography2FontFamily({
    v,
    device,
    prefix,
    state,
    store,
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

  const color = getColor(colorPalette, colorHex, colorOpacity);

  return `color:${color};`;
}

export function cssStyleElementRichTextDCColor({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "bgColor" });
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
  state,
  store
}: CSSValue): string {
  if (v.bgColorType !== "gradient") {
    return "";
  }

  const dcGradient = styleElementRichTextDCGradient({
    v,
    device,
    state,
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
    store
  });

  return `background-image: ${dcGradient};`;
}

export function cssStyleElementRichTextH1FontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "h1",
    renderContext
  });
}

export function cssStyleElementRichTextH1FontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "h1" });
}

export function cssStyleElementRichTextH1LineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "h1" });
}

export function cssStyleElementRichTextH1FontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "h1" });
}

export function cssStyleElementRichTextH1LetterSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "h1"
  });
}

export function cssStyleElementRichTextH1FontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "h1" });
}

export function cssStyleElementRichTextH1TextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "h1" });
}

export function cssStyleElementRichTextH1Script({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, store, prefix: "h1" });
}

export function cssStyleElementRichTextH2FontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "h2",
    renderContext
  });
}

export function cssStyleElementRichTextH2FontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "h2" });
}

export function cssStyleElementRichTextH2LineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "h2" });
}

export function cssStyleElementRichTextH2FontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "h2" });
}

export function cssStyleElementRichTextH2LetterSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "h2"
  });
}

export function cssStyleElementRichTextH2FontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "h2" });
}

export function cssStyleElementRichTextH2TextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "h2" });
}

export function cssStyleElementRichTextH2Script({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, store, prefix: "h2" });
}

export function cssStyleElementRichTextH3FontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "h3",
    renderContext
  });
}

export function cssStyleElementRichTextH3FontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "h3" });
}

export function cssStyleElementRichTextH3LineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "h3" });
}

export function cssStyleElementRichTextH3FontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "h3" });
}

export function cssStyleElementRichTextH3LetterSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "h3"
  });
}

export function cssStyleElementRichTextH3FontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "h3" });
}

export function cssStyleElementRichTextH3TextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "h3" });
}

export function cssStyleElementRichTextH3Script({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, store, prefix: "h3" });
}

export function cssStyleElementRichTextH4FontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "h4",
    renderContext
  });
}

export function cssStyleElementRichTextH4FontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "h4" });
}

export function cssStyleElementRichTextH4LineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "h4" });
}

export function cssStyleElementRichTextH4FontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "h4" });
}

export function cssStyleElementRichTextH4LetterSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "h4"
  });
}

export function cssStyleElementRichTextH4FontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "h4" });
}

export function cssStyleElementRichTextH4TextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "h4" });
}

export function cssStyleElementRichTextH4Script({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, store, prefix: "h4" });
}

export function cssStyleElementRichTextH5FontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "h5",
    renderContext
  });
}

export function cssStyleElementRichTextH5FontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "h5" });
}

export function cssStyleElementRichTextH5LineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "h5" });
}

export function cssStyleElementRichTextH5FontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "h5" });
}

export function cssStyleElementRichTextH5LetterSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "h5"
  });
}

export function cssStyleElementRichTextH5FontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "h5" });
}

export function cssStyleElementRichTextH5TextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "h5" });
}

export function cssStyleElementRichTextH5Script({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, store, prefix: "h5" });
}

export function cssStyleElementRichTextH6FontFamily({
  v,
  device,
  store,
  renderContext
}: CSSValue & WithRenderContext): string {
  return cssStyleTypography2FontFamily({
    v,
    device,
    store,
    prefix: "h6",
    renderContext
  });
}

export function cssStyleElementRichTextH6FontSize({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontSize({ v, device, store, prefix: "h6" });
}

export function cssStyleElementRichTextH6LineHeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2LineHeight({ v, device, store, prefix: "h6" });
}

export function cssStyleElementRichTextH6FontWeight({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontWeight({ v, device, store, prefix: "h6" });
}

export function cssStyleElementRichTextH6LetterSpacing({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTypography2LetterSpacing({
    v,
    device,
    state,
    store,
    prefix: "h6"
  });
}

export function cssStyleElementRichTextH6FontVariation({
  v,
  device,
  store
}: CSSValue): string {
  return cssStyleTypography2FontVariation({ v, device, store, prefix: "h6" });
}

export function cssStyleElementRichTextH6TextTransform({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextTransforms({ v, device, state, store, prefix: "h6" });
}

export function cssStyleElementRichTextH6Script({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleTextScript({ v, device, state, store, prefix: "h6" });
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
  prefix = "content"
}: CSSValue): string {
  const align = styleAlignHorizontal({ v, device, state, store, prefix });

  return align ? `text-align:${align}!important;` : "";
}
