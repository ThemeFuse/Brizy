import { ConfigCommon } from "../ConfigCommon";

export const isImageZoomEnabled = (config: ConfigCommon): boolean => {
  const featureValue = config.ui?.features?.imageZoom;
  const elementValue = config.ui?.elements?.image?.imageZoom;

  return elementValue ?? featureValue ?? false;
};

export const isImagePointerEnabled = (config: ConfigCommon): boolean => {
  const featureValue = config.ui?.features?.imagePointer;
  const elementValue = config.ui?.elements?.image?.imagePointer;

  return elementValue ?? featureValue ?? false;
};

type ElementType =
  | "section"
  | "audio"
  | "column"
  | "sectionMegaMenu"
  | "menu"
  | "richText"
  | "row"
  | "sectionPopup"
  | "sectionPopup2"
  | "sectionHeader"
  | "sectionFooter"
  | "videoPlaylist"
  | "video"
  | "story";

export const isBackgroundPointerEnabled = (
  config: ConfigCommon,
  elementType: ElementType
): boolean => {
  const featureValue = config.ui?.features?.backgroundPointer;
  const elementValue = config.ui?.elements?.[elementType]?.backgroundPointer;

  return elementValue ?? featureValue ?? false;
};
