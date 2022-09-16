import { cssStyleColor, cssStylePadding } from "visual/utils/cssStyle";
import { MOBILE, TABLET } from "visual/utils/responsiveMode";
import {
  styleElementSectionContainerSize,
  styleElementSectionContainerType,
  styleElementSectionHeight,
  styleElementSectionMinHeight,
  styleElementSectionMinHeightSuffix,
  styleElementSectionSliderHeight,
  styleMarginGrouped,
  styleMarginGroupedSuffix,
  styleMarginType,
  styleMarginUngrouped,
  styleMarginUngroupedSuffix
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";

const validation = (k) => k !== undefined;

export function cssStyleSectionMaxWidth({ v, device, state }) {
  const containerType = styleElementSectionContainerType({ v, device, state });
  const containerSize = styleElementSectionContainerSize({ v, device, state });
  // used css var(--brz-section-container-width)
  // improvement in the future & need for blocksy
  const toPercentage = containerSize / 100;
  let maxWidth = `calc(${toPercentage} * var(--brz-section-container-max-width, 1170px));`;

  if (device === TABLET || device === MOBILE) {
    maxWidth = `${containerSize}%`;
  }

  return containerType === "boxed"
    ? `max-width: ${maxWidth}`
    : "max-width: 100%;";
}

export function cssStyleSectionSliderHeight({ v }) {
  const sliderHeight =
    styleElementSectionSliderHeight({ v }) === "on" ? "height" : "min-height";
  const height = styleElementSectionHeight({ v }) === "on" ? "100vh" : "100%";

  return validation(height) ? `${sliderHeight}: ${height};` : "";
}

export function cssStyleSectionColorDots({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "sliderDotsColor" });
}

export function cssStyleSectionColorArrows({ v, device, state }) {
  return cssStyleColor({ v, device, state, prefix: "sliderArrowsColor" });
}

export function cssStyleSectionPropertyHoverTransition() {
  return "transition-property: filter, background, border, border-radius;";
}

export function cssStyleSectionToolbarOffset({ v, device, state }) {
  const toolbarSpacing = 42;
  const marginType = styleMarginType({ v, device, state });
  let marginTop;
  let marginTopSuffix;

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

export function cssStyleSectionPaddingsForEditorResize({ v, device, state }) {
  if (IS_EDITOR) {
    const { paddingLeft, paddingLeftSuffix, paddingRight, paddingRightSuffix } =
      cssStylePadding({ v, device, state });
    const _paddingLeft = `${paddingLeft}${paddingLeftSuffix}`;
    const _paddingRight = `${paddingRight}${paddingRightSuffix}`;

    return `margin-left: -${_paddingLeft}; margin-right: -${_paddingRight}; width: calc(100% + ${_paddingRight} + ${_paddingLeft});`;
  }
}

export function cssStyleSectionBgSize({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const bgSize = dvv("bgSize");

  return `background-size:${bgSize};`;
}

export function cssStyleSectionBgRepeat({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const bgRepeat = dvv("bgRepeat");

  return `background-repeat:${bgRepeat === "on" ? "repeat" : "no-repeat"};`;
}
