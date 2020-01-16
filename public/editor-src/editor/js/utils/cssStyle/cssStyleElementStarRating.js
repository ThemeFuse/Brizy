import { styleColor } from "visual/utils/style2";

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

export function cssStyleElementStarRatingPropertyHoverTransition() {
  return "transition-property: color;";
}
