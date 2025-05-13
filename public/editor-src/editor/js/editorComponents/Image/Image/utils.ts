import { RetinaData } from "visual/editorComponents/Image/Image/SimpleImage";
import { Meta } from "visual/editorComponents/Image/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  SizeType,
  defaultCrop
} from "visual/global/Config/types/configs/common";
import { getImageUrl } from "visual/utils/image";

export const formatHoverRetinaSrc = (
  { sizeType, src, maxCw, fileName }: RetinaData,
  config: ConfigCommon
): string => {
  const common = {
    fileName,
    uid: src,
    sizeType: SizeType.custom
  };

  switch (sizeType) {
    case SizeType.custom: {
      const url_1X = getImageUrl(
        {
          ...common,
          crop: { ...defaultCrop, iW: maxCw }
        },
        config
      );
      const url_2X = getImageUrl(
        {
          ...common,
          crop: { ...defaultCrop, iW: maxCw * 2 }
        },
        config
      );
      return `${url_1X} 1x, ${url_2X} 2x`;
    }
    default: {
      const url = getImageUrl({ ...common, sizeType }, config);
      return `${url} 1x, ${url} 2x`;
    }
  }
};

export const formatHoverSrc = (
  { sizeType, src, maxCw, fileName }: RetinaData,
  config: ConfigCommon
): string => {
  switch (sizeType) {
    case SizeType.custom: {
      return (
        getImageUrl(
          {
            fileName,
            sizeType: SizeType.custom,
            uid: src,
            crop: { ...defaultCrop, iW: maxCw, iH: "any" }
          },
          config
        ) ?? ""
      );
    }
    default: {
      return getImageUrl({ sizeType, uid: src, fileName }, config) ?? "";
    }
  }
};

export const getFallbackMeta = (): Meta => ({
  desktopW: 0,
  tabletW: 0,
  mobileW: 0,
  gallery: {
    inGallery: false
  },
  _dc: {}
});
