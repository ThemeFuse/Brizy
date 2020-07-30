import { MOBILE } from "visual/utils/responsiveMode";
import {
  styleElementMegaMenuWidth,
  styleElementMegaMenuWidthSuffix,
  styleElementMegaMenuOffsetTop,
  styleElementMegaMenuHeight,
  styleElementMegaMenuHeightStyle,
  styleElementMegaMenuHeightSuffix,
  styleElementMenuMode
} from "visual/utils/style2";

export function cssStyleElementMegaMenuWidth({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  // max-width need only horizontal and mobile
  if (mode === "vertical" || device === MOBILE) {
    const width = styleElementMegaMenuWidth({ v, device, state });
    const suffix = styleElementMegaMenuWidthSuffix({ v, device, state });

    return `max-width: ${width}${suffix};`;
  }

  return "max-width: 100%;";
}

export function cssStyleElementMegaMenuOffsetTop({ v, device, state }) {
  const megaMenuOffsetTop = styleElementMegaMenuOffsetTop({ v, device, state });

  return `padding: ${megaMenuOffsetTop}px;`;
}

export function cssStyleElementMegaMenuHeight({ v, device, state }) {
  const style = styleElementMegaMenuHeightStyle({ v, device, state });

  if (style === "custom") {
    const height = styleElementMegaMenuHeight({ v, device, state });
    const suffix = styleElementMegaMenuHeightSuffix({ v, device, state });

    return `min-height: ${height}${suffix};`;
  }

  return "min-height: auto;";
}

export function cssStyleElementMegaMenuOpened({ v, device, state }) {
  const mode = styleElementMenuMode({ v, device, state });

  // display: block need only vertical and mobile
  if (mode === "vertical" || device === MOBILE) {
    return "display: block";
  }

  return "display: none;";
}
