import { styleColor } from "visual/utils/style2";
import { defaultValueValue } from "visual/utils/onChange";

export function cssStyleElementStarRatingRatingColor({
  v,
  device,
  state,
  prefix = "ratingColor"
}) {
  return `color: ${styleColor({
    v,
    device,
    state,
    prefix
  })};`;
}

export function cssStyleElementStarRatingRatingBackgroundColor({
  v,
  device,
  state,
  prefix = "ratingBackgroundColor"
}) {
  return `color: ${styleColor({
    v,
    device,
    state,
    prefix
  })};`;
}

export function cssStyleElementStarRatingStyle2Background({
  v,
  device,
  state,
  prefix = "bgColor"
}) {
  return `background-color: ${styleColor({
    v,
    device,
    state,
    prefix
  })};`;
}

export function cssStyleElementStarRatingStyle2BorderRadius({ v, device }) {
  const dvv = key => defaultValueValue({ v, key, device });

  return `border-radius: ${dvv("borderRadius")}px;`;
}

export function cssStyleElementStarRatingPropertyHoverTransition() {
  return "transition-property: color;";
}

export function cssStyleElementStarRatingDirection({ v, device }) {
  const dvv = key => defaultValueValue({ key, v, device });
  const label = dvv("label");

  return label === "on"
    ? "display: flex; flex-direction: row;"
    : "display: flex; flex-direction: row-reverse;";
}

export function cssStyleElementStarRatingTextSpacing({ v, device }) {
  const dvv = key => defaultValueValue({ key, v, device });
  const spacing = dvv("spacing");
  const label = dvv("label");
  const ratingStyle = dvv("ratingStyle");

  switch (label) {
    case "on": {
      return `margin-right: ${spacing}px;`;
    }
    case "on-right": {
      return ratingStyle === "style-2"
        ? `margin-right: ${spacing}px; margin-left: 0;`
        : `margin-left: ${spacing}px; margin-right: 0;`;
    }
    case "off": {
      return "margin: 0;";
    }
  }
}
