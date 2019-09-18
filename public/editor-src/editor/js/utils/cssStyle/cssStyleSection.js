import {
  styleElementSectionSliderHeight,
  styleElementSectionHeight,
  styleElementSectionContainerType,
  styleElementSectionContainerSize,
  styleColor
} from "visual/utils/style2";

export function cssStyleSectionMaxWidth({ v }) {
  const containerType = styleElementSectionContainerType({ v });
  const containerSize = styleElementSectionContainerSize({ v });
  return containerType === "boxed"
    ? `max-width: ${containerSize}%;`
    : "max-width: 100%;";
}

export function cssStyleSectionContainerType({ v }) {
  const containerType = styleElementSectionContainerType({ v });

  return containerType === "fullWidth"
    ? "max-width: 100%;"
    : "max-width: 1170px;";
}

export function cssStyleSectionSliderHeight({ v }) {
  const sliderHeight =
    styleElementSectionSliderHeight({ v }) === "on" ? "height" : "min-height";
  const height = styleElementSectionHeight({ v }) === "on" ? "100vh" : "100%";

  return height === undefined ? "" : `${sliderHeight}: ${height};`;
}

export function cssStyleSectionColorDots({
  v,
  device,
  state,
  prefix = "sliderDotsColor"
}) {
  const colorDots = styleColor({ v, device, state, prefix });
  return colorDots === undefined ? "" : `color: ${colorDots};`;
}

export function cssStyleSectionColorArrows({
  v,
  device,
  state,
  prefix = "sliderArrowsColor"
}) {
  const colorArrows = styleColor({ v, device, state, prefix });
  return colorArrows === undefined ? "" : `color: ${colorArrows};`;
}

export function cssStyleSectionPropertyHoverTransition() {
  return `transition-property: background, border, border-radius;`;
}
