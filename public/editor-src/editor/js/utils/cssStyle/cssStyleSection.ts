import { WithRenderContext, isEditor } from "visual/providers/RenderProvider";
import { cssStyleColor, cssStylePadding } from "visual/utils/cssStyle";
import { defaultValueValue } from "visual/utils/onChange";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import {
  styleMarginUngrouped,
  styleMarginUngroupedSuffix
} from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";
import { checkValue } from "../checkValue";

const validation = (k: string) => k !== undefined;

enum ContainerTypes {
  Boxed = "boxed",
  FullWidth = "fullWidth"
}
const getContainerTypes = checkValue<ContainerTypes>([
  ContainerTypes.Boxed,
  ContainerTypes.FullWidth
]);

export function cssStyleSectionMaxWidth({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const containerType = getContainerTypes(dvv("containerType"));
  const containerSize = dvv("containerSize");
  const containerSizeSuffix =
    dvv("containerSizeSuffix") === "" ? "%" : dvv("containerSizeSuffix");

  const percentSuffix = containerSizeSuffix === "%";
  const pixelSuffix = containerSizeSuffix === "px";

  const responsiveMode =
    percentSuffix && (device === TABLET || device === MOBILE);

  const toPercentage = containerSize / 100;

  // used css var(--brz-section-container-width)
  // improvement in the future & need for blocksy
  const maxWidth = `calc(${toPercentage} * var(--brz-section-container-max-width, 1170px));`;

  switch (containerType) {
    case ContainerTypes.Boxed: {
      if (percentSuffix && device === DESKTOP) {
        return `max-width: ${maxWidth}`;
      } else if (pixelSuffix || responsiveMode) {
        return `max-width: ${containerSize}${containerSizeSuffix};`;
      } else return "";
    }
    case ContainerTypes.FullWidth: {
      return "max-width: 100%;";
    }

    case undefined:
      return "";
  }
}

export function cssStyleSectionSliderHeight({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const sliderHeight = dvv("slider") === "on" ? "height" : "min-height";
  const height = dvv("fullHeight") === "on" ? "100vh" : "100%";

  return validation(height) ? `${sliderHeight}: ${height};` : "";
}

export function cssStyleSectionColorDots({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({ v, device, state, store, prefix: "sliderDotsColor" });
}

export function cssStyleSectionColorArrows({
  v,
  device,
  state,
  store
}: CSSValue): string {
  return cssStyleColor({
    v,
    device,
    state,
    store,
    prefix: "sliderArrowsColor"
  });
}

export function cssStyleSectionToolbarOffset({
  v,
  device,
  state
}: CSSValue): string {
  const toolbarSpacing = 42;

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const marginType = dvv("marginType");

  let marginTop;
  let marginTopSuffix;

  if (marginType === "grouped") {
    marginTop = dvv("margin");
    marginTopSuffix = dvv("marginSuffix");
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

export function cssStyleSectionHeightStyle({ v, device }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const minHeightType = dvv("fullHeight");

  const minHeight =
    minHeightType === "custom"
      ? `${dvv("sectionHeight")}${dvv("sectionHeightSuffix")}`
      : minHeightType === "on"
        ? "100vh"
        : "auto";

  return `min-height: ${minHeight};`;
}

export function cssStyleSectionPaddingsForEditorResize({
  v,
  device,
  state,
  renderContext
}: CSSValue & WithRenderContext): string {
  if (isEditor(renderContext)) {
    const { paddingLeft, paddingLeftSuffix, paddingRight, paddingRightSuffix } =
      cssStylePadding({ v, device, state });

    const _paddingLeft = `${paddingLeft}${paddingLeftSuffix}`;
    const _paddingRight = `${paddingRight}${paddingRightSuffix}`;

    return `margin-left: -${_paddingLeft}; margin-right: -${_paddingRight}; width: calc(100% + ${_paddingRight} + ${_paddingLeft});`;
  } else return "";
}
