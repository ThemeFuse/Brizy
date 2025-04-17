import {
  cssStyleDisplayBlock,
  cssStyleDisplayNone,
  cssStyleSizeMaxWidth,
  cssStyleSizeMinHeightPx
} from "visual/utils/cssStyle";
import { MOBILE } from "visual/utils/responsiveMode";
import {
  styleElementMegaMenuHeightStyle,
  styleElementMegaMenuOffsetTop,
  styleElementMenuMode
} from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleElementMegaMenuWidth({
  v,
  device,
  state,
  getConfig,
  store
}: CSSValue): string {
  const mode = styleElementMenuMode({ v, device, state });

  // max-width need only horizontal and mobile
  if (mode === "vertical" || device === MOBILE) {
    return cssStyleSizeMaxWidth({
      v,
      device,
      state,
      getConfig,
      store,
      prefix: "megaMenu"
    });
  }

  return "max-width: 100%;";
}

export function cssStyleElementMegaMenuOffsetTop({
  v,
  device,
  state
}: CSSValue): string {
  const megaMenuOffsetTop = styleElementMegaMenuOffsetTop({ v, device, state });

  return `padding: ${megaMenuOffsetTop}px;`;
}

export function cssStyleElementMegaMenuHeight({
  v,
  device,
  getConfig,
  state,
  store
}: CSSValue): string {
  const style = styleElementMegaMenuHeightStyle({ v, device, state });

  if (style === "custom") {
    return cssStyleSizeMinHeightPx({
      v,
      device,
      state,
      getConfig,
      store,
      prefix: "section"
    });
  }

  return "min-height: auto;";
}

export function cssStyleElementMegaMenuOpened({
  v,
  device,
  state
}: CSSValue): string {
  const mode = styleElementMenuMode({ v, device, state });

  // display: block need only vertical and mobile
  if (mode === "vertical" || device === MOBILE) {
    return cssStyleDisplayBlock();
  }

  return cssStyleDisplayNone();
}
