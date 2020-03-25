import {
  styleElementSectionSliderHeight,
  styleElementSectionHeight,
  styleElementSectionContainerType,
  styleElementSectionContainerSize,
  styleElementSectionMinHeight,
  styleElementSectionMinHeightSuffix,
  styleColor,
  styleMarginType,
  styleMarginUngrouped,
  styleMarginGrouped,
  styleMarginGroupedSuffix,
  styleMarginUngroupedSuffix
} from "visual/utils/style2";

const validation = k => k !== undefined;

export function cssStyleSectionMaxWidth({ v, device, state }) {
  const containerType = styleElementSectionContainerType({ v, device, state });
  const containerSize = styleElementSectionContainerSize({ v, device, state });
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

  return validation(height) ? `${sliderHeight}: ${height};` : "";
}

export function cssStyleSectionColorDots({
  v,
  device,
  state,
  prefix = "sliderDotsColor"
}) {
  const colorDots = styleColor({ v, device, state, prefix });
  return validation(colorDots) ? `color: ${colorDots};` : "";
}

export function cssStyleSectionColorArrows({
  v,
  device,
  state,
  prefix = "sliderArrowsColor"
}) {
  const colorArrows = styleColor({ v, device, state, prefix });
  return validation(colorArrows) ? `color: ${colorArrows};` : "";
}

export function cssStyleSectionPropertyHoverTransition() {
  return "transition-property: filter, background, border, border-radius;";
}

export function cssStyleSectionToolbarOffset({ v, device, state }) {
  const toolbarSpacing = 44;
  const marginType = styleMarginType({ v, device, state });
  let marginTop = 0;
  let marginTopSuffix = "";

  if (marginType === "grouped") {
    marginTop = styleMarginGrouped({ v, device, state });
    marginTopSuffix = styleMarginGroupedSuffix({ v, device, state });
  } else {
    marginTop = styleMarginUngrouped({
      v,
      device,
      state,
      current: "marginTop"
    });
    marginTopSuffix = styleMarginUngroupedSuffix({
      v,
      device,
      state,
      current: "marginTopSuffix"
    });
  }

  if (!validation(marginTop)) {
    return "";
  } else if (marginTop < 0) {
    let height = toolbarSpacing + -marginTop;

    if (marginTopSuffix === "%") {
      // need rapport percentage to px
      const section = document.querySelector(`[data-uid="${v._id}"]`);

      if (section) {
        const sectionWidth = section.getBoundingClientRect().width;
        height = toolbarSpacing + (sectionWidth / 100) * -marginTop;
      }
    }

    return `grid-template-rows: minmax(calc(100% - 42px), ${height}px) 42px;`;
  }

  return `grid-template-rows: minmax(calc(100% - 42px), ${toolbarSpacing}px) 42px;`;
}

export function cssStyleSectionHeightStyle({ v, device }) {
  const minHeightType = styleElementSectionHeight({ v, device });
  const minHeight =
    minHeightType === "custom"
      ? `${styleElementSectionMinHeight({
          v,
          device
        })}${styleElementSectionMinHeightSuffix({ v, device })}`
      : minHeightType === "on"
      ? "100vh"
      : "auto";

  return `min-height: ${minHeight};`;
}
