import Config, { WP } from "visual/global/Config";
import { defaultCrop } from "visual/global/Config/types/configs/common";
import { isDynamicContent } from "visual/utils/dynamicContent";
import { is as isNoEmptyString } from "visual/utils/string/NoEmptyString";
import {
  isAbsoluteUrl,
  objectToQueryString,
  urlContainsQueryString
} from "visual/utils/url";
import { MValue } from "visual/utils/value";
import { Data, ImageType } from "./types";
import {
  getFilter,
  getUnsplashCrop,
  isCropSize,
  isUnsplashImage
} from "./utils";

export const getImageUrl = ({
  imageType = ImageType.Internal,
  ...data
}: Data): MValue<string> => {
  if (!isNoEmptyString(data.uid)) {
    return undefined;
  }

  if (isUnsplashImage(imageType)) {
    return getUnsplashCrop(data);
  }

  if (isAbsoluteUrl(data.uid) || isDynamicContent(data.uid)) {
    return data.uid;
  }

  const config = Config.getAll() as WP;
  const { api = {} } = config ?? {};
  const { media = {} } = api;

  if (media.mediaResizeUrl) {
    const { uid: src, sizeType } = data;
    const prefix = config.prefix ?? "brizy";
    const imageUrlPrefix = urlContainsQueryString(media.mediaResizeUrl)
      ? `${media.mediaResizeUrl}&`
      : `${media.mediaResizeUrl}/?`;

    const filter = isCropSize(data)
      ? getFilter({ ...defaultCrop, ...data.crop })
      : sizeType;
    const queryString = objectToQueryString({
      [`${prefix}_media`]: src,
      [`${prefix}_crop`]: filter
    });

    return `${imageUrlPrefix}${queryString}`;
  }

  return undefined;
};
