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

interface LinkOptions {
  internalLink: boolean;
  linkExternal: boolean;
  linkUpload: boolean;
  linkAnchor: boolean;
  linkPopup: boolean;
}

export const getEnabledLinkOptions = (config: ConfigCommon): LinkOptions => {
  const link = config.ui?.features?.link;

  if (!link) {
    return {
      internalLink: true,
      linkExternal: true,
      linkUpload: true,
      linkAnchor: true,
      linkPopup: true
    };
  }

  const initial = {
    internalLink: false,
    linkExternal: false,
    linkUpload: false,
    linkAnchor: false,
    linkPopup: false
  };

  return Object.keys(initial).reduce<LinkOptions>((acc, key) => {
    const _key = key as keyof LinkOptions;

    if (link[_key]) {
      acc[_key] = true;
    }

    return acc;
  }, initial);
};
