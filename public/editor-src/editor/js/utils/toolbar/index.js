export function makeEmptySidebarConfig({ title }) {
  return {
    title,
    getItems() {
      return [];
    }
  };
}

// BG Image
export { toolbarBgImage } from "./toolbarBgImage";

// BG Video
export { toolbarBgVideoUrl } from "./toolbarBgVideo";

// Color
export { toolbarColor2, toolbarColorHexField2 } from "./toolbarColor";

// Gradient
export {
  toolbarGradientLinearDegree,
  toolbarGradientRadialDegree
} from "./toolbarGradient";

// BG Color
export { toolbarBgColor2, toolbarBgColorHexField2 } from "./toolbarBgColor";

// Border Color
export {
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthOneField2,
  toolbarBorderWidthFourFields2
} from "./toolbarBorder";

//Box Shadow
export {
  toolbarBoxShadowFields2,
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2
} from "./toolbarBoxShadow";

export { toolbarTextShadowHexField2 } from "./toolbarTextShadow";

// Anchor and URL
export {
  toolbarLinkAnchor,
  toolbarLinkExternal,
  toolbarStoryAnchor,
  toolbarLinkPopup
} from "./toolbarLink";

// Show on Devices
export {
  toolbarShowOnTablet,
  toolbarShowOnMobile,
  toolbarShowOnResponsive
} from "./toolbarShowOnDevices";

// Filter
export {
  toolbarFilterHue,
  toolbarFilterSaturation,
  toolbarFilterBrightness,
  toolbarFilterContrast
} from "./toolbarFilters";

// Disabled
export {
  toolbarDisabledShowOnResponsive,
  toolbarDisabledToolbarSettings,
  toolbarDisabledShowOnTablet,
  toolbarDisabledShowOnMobile,
  toolbarDisabledPadding,
  toolbarDisabledMargin,
  toolbarDisabledDuplicate,
  toolbarDisabledRemove
} from "./toolbarDisabled";

// Element Containers
export { toolbarElementContainerTypeImageMap } from "./toolbarElementContainer";

// Element Section
export { getInstanceParentId } from "./toolbarElementSection";

// Element SoundCloud
export { toolbarElementSoundCloudStyle } from "./toolbarElementSoundCloud";

// Element Image
export {
  toolbarImageLinkExternal,
  toolbarImageTags
} from "./toolbarElementImage";

// Typography
export {
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2LineHeight,
  toolbarTypography2LetterSpacing
} from "./toolbarTypography2";

//Element WP Posts
export { toolbarElementWPPostsNumber } from "./toolbarElementWPPosts";

export {
  toolbarElementForm2Apps,
  toolbarElementForm2Size
} from "./toolbarElementForm2";

// Shape
export { toolbarShapeTopFlip, toolbarShapeBottomFlip } from "./toolbarShape";
