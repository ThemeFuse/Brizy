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
  toolbarGradientRange,
  toolbarGradientType,
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
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarBoxShadowFields2
} from "./toolbarBoxShadow";

export {
  toolbarTextShadow,
  toolbarTextShadowHexField2,
  toolbarTextShadowFields2
} from "./toolbarTextShadow";

// Anchor and URL
export {
  toolbarLinkAnchor,
  toolbarLinkExternal,
  toolbarStoryAnchor,
  toolbarLinkExternalBlank,
  toolbarLinkExternalRel,
  toolbarLinkPopup,
  toolbarLinkUpload
} from "./toolbarLink";

// Margin
export { toolbarMargin } from "./toolbarMargin";

// Show on Devices
export {
  toolbarShowOnTablet,
  toolbarShowOnMobile,
  toolbarShowOnResponsive
} from "./toolbarShowOnDevices";

// Custom CSS Class
export { toolbarCustomCSSClass } from "./toolbarCustomCSSClass";

// Entrance Animation
export { toolbarEntranceAnimation } from "./toolbarAnimation";

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
export {
  toolbarElementSectionBoxShadow,
  toolbarElementSectionSaved,
  toolbarElementSectionGlobal
} from "./toolbarElementSection";

// Element Video
export {
  toolbarElementVideoUpload,
  toolbarElementVideoPlaySize
} from "./toolbarElementVideo";

// Element SoundCloud
export { toolbarElementSoundCloudStyle } from "./toolbarElementSoundCloud";

// Element Cloneable
export { toolbarElementCloneableSpacing } from "./toolbarElementCloneable";

// Element Image
export {
  toolbarImageLinkExternal,
  toolbarImageTags,
  toolbarImageBorderRadius
} from "./toolbarElementImage";

// Typography
export {
  toolbarTypography2FontFamily,
  toolbarTypography2FontStyle,
  toolbarTypography2FontSize,
  toolbarTypography2FontSizeSuffix,
  toolbarTypography2LineHeight,
  toolbarTypography2FontWeight,
  toolbarTypography2LetterSpacing
} from "./toolbarTypography2";

//Element WP Posts
export { toolbarElementWPPostsNumber } from "./toolbarElementWPPosts";

export {
  toolbarElementForm2SpacingPx,
  toolbarElementForm2Apps,
  toolbarElementForm2Size
} from "./toolbarElementForm2";

// Element Login
export { toolbarElementLoginSpacingPx } from "./toolbarElementLogin";

// Shape
export {
  toolbarShapeTopType,
  toolbarShapeTopFlip,
  toolbarShapeBottomType,
  toolbarShapeBottomFlip
} from "./toolbarShape";

// Element Audio
export {
  toolbarElementAudioUpload,
  toolbarElementAudioIconSize
} from "./toolbarElementAudio";

// Element WP Posts
export {
  toolbarElementPostsTaxonomy,
  toolbarElementPostsColumns,
  toolbarElementPostsRows
} from "./toolbarElementPosts";

// Element Carousel
export {
  toolbarElementCarouselTaxonomy,
  toolbarElementCarouselPadding
} from "./toolbarElementCarousel";

// Twitter
export { toolbarElementTwitter } from "./toolbarElementTwitter";
