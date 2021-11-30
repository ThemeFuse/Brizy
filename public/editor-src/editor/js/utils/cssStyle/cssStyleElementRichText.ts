import {
  styleElementRichTextMarginTop,
  styleElementRichTextMarginBottom,
  styleElementRichTextGradient,
  styleElementRichTextBGImagePositionX,
  styleElementRichTextBGImagePositionY,
  styleElementRichTextFontFamily
} from "visual/utils/style2/styleElementRichText";
import { IS_STORY } from "../models";
import { styleState, styleTypography2FontSize } from "../style2";
import { CSSValue } from "../style2/types";
import { cssStyleTypography3FontSize } from "./cssStyleTypography2";
import { styleBgImage, styleExportBgImage } from "visual/utils/style2";
import { ElementModel } from "visual/component/Elements/Types";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { State } from "visual/utils/stateMode";
import { capByPrefix } from "visual/utils/string";
import { hexToRgba } from "visual/utils/color";

export function cssStyleElementRichTextMartinTop(d: CSSValue): string {
  const marginTop = styleElementRichTextMarginTop(d);

  return marginTop === undefined ? "" : `margin-top:${marginTop}px !important;`;
}

export function cssStyleElementRichTextMartinBottom(d: CSSValue): string {
  const marginBottom = styleElementRichTextMarginBottom(d);

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
  return IS_STORY
    ? `font-size:${styleTypography2FontSize({ ...d, prefix: "typography" }) *
        0.23}%;`
    : cssStyleTypography3FontSize(d);
}

export function cssStyleElementRichTextBgImage({
  v,
  device,
  state
}: CSSValue): string {
  const bgImage = IS_EDITOR
    ? styleBgImage({ v, device, state })
    : styleExportBgImage({ v, device, state });

  const x = styleElementRichTextBGImagePositionX({
    v,
    device,
    state
  });

  const y = styleElementRichTextBGImagePositionY({
    v,
    device,
    state
  });

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
  return `font-family:${styleElementRichTextFontFamily({
    v,
    device,
    prefix,
    state
  })} !important;`;
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
