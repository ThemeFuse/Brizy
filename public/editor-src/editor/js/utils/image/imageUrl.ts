import { isWp } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getFileFormat } from "visual/utils/customFile/utils";
import { isDynamicContent } from "visual/utils/dynamicContent";
import { parseImagePatterns } from "visual/utils/image/parsers";
import {
  NoEmptyString,
  is as isNoEmptyString
} from "visual/utils/string/NoEmptyString";
import { isAbsoluteUrl } from "visual/utils/url";
import { MValue } from "visual/utils/value";
import { Data, DataUrl, ImageType } from "./types";
import {
  generateUrl,
  getUnsplashCrop,
  isCropSize,
  isUnsplashImage
} from "./utils";

const getUrl = (data: Data, options: DataUrl): string => {
  if (isCropSize(data)) {
    return generateUrl({ ...options, crop: data.crop });
  }

  return generateUrl(options);
};

export const getImageUrl = (
  { imageType = ImageType.Internal, ...data }: Data,
  config: ConfigCommon
): MValue<string> => {
  if (!isNoEmptyString(data.uid)) {
    return undefined;
  }

  if (isUnsplashImage(imageType)) {
    return getUnsplashCrop(data);
  }

  if (isAbsoluteUrl(data.uid) || isDynamicContent(data.uid)) {
    return data.uid;
  }

  const { api = {} } = config ?? {};
  const { media = {} } = api;
  const { isOldImage, imagePatterns, mediaResizeUrl } = media;

  const parsedImagePatterns = parseImagePatterns(imagePatterns);

  if (!parsedImagePatterns || !mediaResizeUrl) {
    return undefined;
  }

  const { uid, fileName } = data;
  const extension = getFileFormat(uid);

  if (fileName) {
    let newFileName = fileName;
    let newUid = uid;

    // Only for WP,
    // always return uid
    if (isWp(config)) {
      const options = {
        fileName: uid,
        baseUrl: mediaResizeUrl,
        patterns: parsedImagePatterns,
        sizeType: data.sizeType
      };

      return getUrl(data, options);
    }

    // (1) New Cloud where we have fileName and uid with file extension
    // Check for fileName (new api)
    if (extension) {
      // remove extension for fileName
      // add extension from UID to fileName
      // the API is doesn't work with original .ext of file
      const fileNameExt = getFileFormat(fileName) ?? "";
      const _fileName = fileName.replace(`.${fileNameExt}`, "");
      newFileName = `${_fileName}.${extension}`;
      newUid = uid.replace(`.${extension}`, "") as NoEmptyString;
    }

    // (1.1) For Third-Party app who used
    // uid and fileName, but uid without extensions
    const options = {
      uid: newUid,
      fileName: newFileName,
      baseUrl: mediaResizeUrl,
      patterns: parsedImagePatterns,
      sizeType: data.sizeType
    };

    return getUrl(data, options);
  }

  // (2) OLD Cloud
  if (isOldImage && extension) {
    const fileName = `image.${extension}`;
    const newUid = uid.replace(`.${extension}`, "") as NoEmptyString;
    const options = {
      fileName,
      uid: newUid,
      baseUrl: mediaResizeUrl,
      patterns: parsedImagePatterns,
      sizeType: data.sizeType
    };

    return getUrl(data, options);
  }

  // (3) WP & All Third-party partners
  const options = {
    fileName: uid,
    baseUrl: mediaResizeUrl,
    patterns: parsedImagePatterns,
    sizeType: data.sizeType
  };

  return getUrl(data, options);
};
