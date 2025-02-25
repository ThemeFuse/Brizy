import {
  cssStyleColor,
  cssStyleCustomIconColor,
  cssStyleSpacing
} from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";

export function cssStyleElementStarRatingRatingColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "ratingColor"
  });
}

export function cssStyleElementStarRatingRatingBackgroundColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "ratingBackgroundColor"
  });
}

export function cssStyleElementStarRatingDirection({ v, device }) {
  const dvv = (key) => defaultValueValue({ key, v, device });
  const label = dvv("label");

  return label === "on"
    ? "display: flex; flex-direction: row;"
    : "display: flex; flex-direction: row-reverse;";
}

export function cssStyleElementStarRatingTextSpacing({ v, device }) {
  const dvv = (key) => defaultValueValue({ key, v, device });
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

export function cssStyleElementStarRatingSpacing({ v, device, state }) {
  return cssStyleSpacing({
    v,
    device,
    state,
    prefix: "icon",
    direction: "right"
  });
}

export function cssStyleElementStarRatingCustomIconColor({
  v,
  device,
  state,
  store
}) {
  return cssStyleCustomIconColor({
    v,
    device,
    state,
    store,
    prefix: "ratingColor"
  });
}
