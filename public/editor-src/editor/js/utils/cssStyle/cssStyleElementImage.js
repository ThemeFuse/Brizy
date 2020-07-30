import { roundTo } from "visual/utils/math";
import { cssStyleFilter } from "./cssStyleFilter";

export function cssStyleElementImageMaxWidthPreview({ device, props = {} }) {
  const { width } = props.wrapperSizes[device];

  const containerWIdth = props.props.meta[`${device}W`];

  return (width === undefined || width === null) &&
    (containerWIdth === undefined || containerWIdth === null)
    ? ""
    : `max-width: ${Math.round(Math.abs((width * 100) / containerWIdth))}%;`;
}

export function cssStyleElementImageHeightPreview({ v, device, props = {} }) {
  const { height } = props.wrapperSizes[device];

  return height === undefined || height === null
    ? ""
    : !v.imageSrc && !v.imagePopulation
    ? `height: ${height}px;`
    : "height: auto;";
}

export function cssStyleElementImageBorderRadius({ v, device, props = {} }) {
  const { borderRadius } = v;

  const { width, height } = props.wrapperSizes
    ? props.wrapperSizes[device]
    : props[device];

  const maxBorderRadius = Math.round(Math.min(width, height) / 2);

  return (width === undefined || width === null) &&
    (height === undefined || height === null)
    ? ""
    : `border-radius: ${Math.min(borderRadius, maxBorderRadius)}px;`;
}

export function cssStyleElementImageMaxWidthEditor({ device, props = {} }) {
  const { width } = props[device];

  return width === undefined || width === null ? "" : `max-width: ${width}px;`;
}

export function cssStyleElementImageHeightEditor({ device, props = {} }) {
  const { height } = props[device];

  return height === undefined || height === null ? "" : `height: ${height}px;`;
}

export function cssStyleElementImageWidthWrapper({ device, props = {} }) {
  const { width } = props[device];

  return width === undefined || width === null ? "" : `width: ${width}px;`;
}

export function cssStyleElementImageHeightWrapper({ device, props = {} }) {
  const { height } = props[device];

  return height === undefined || height === null ? "" : `height: ${height}px;`;
}

export function cssStyleElementImageMarginLeft({ device, props = {} }) {
  const { marginLeft } = props[device];

  return marginLeft === undefined || marginLeft === null
    ? ""
    : `margin-left: ${marginLeft}px;`;
}

export function cssStyleElementImageMarginTop({ device, props = {} }) {
  const { marginTop } = props[device];

  return marginTop === undefined || marginTop === null
    ? ""
    : `margin-top: ${marginTop}px;`;
}

export function cssStyleElementImagePictureSize({ device, props }) {
  const { width, height } = props[device];

  const paddingTop = roundTo((height / width) * 100, 4);

  return (width === undefined || width === null) &&
    (height === undefined || height === null)
    ? ""
    : `padding-top: ${paddingTop}%;`;
}

export function cssStyleElementImageTransitionProperty() {
  return "transition-property: border, box-shadow, filter;";
}

export function cssStyleElementImageFilter({
  v,
  device,
  state,
  prefix = "image"
}) {
  return cssStyleFilter({ v, device, state, prefix });
}
