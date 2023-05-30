import Config from "visual/global/Config";
import { defaultCrop } from "visual/global/Config/types/configs/common";
import { is as isNoEmptyString } from "visual/utils/string/NoEmptyString";
import { isAbsoluteUrl } from "visual/utils/url";
import { MValue } from "visual/utils/value";
import { getImageFormat } from "./imageFormat";
import { Data } from "./types";
import { getFilter, isCropSize } from "./utils";

export const getImageUrl = (data: Data): MValue<string> => {
  if (!isNoEmptyString(data.uid)) {
    return undefined;
  }

  if (isAbsoluteUrl(data.uid)) {
    return data.uid;
  }

  const config = Config.getAll();
  const { api = {} } = config ?? {};
  const { media = {} } = api;

  if (media.mediaResizeUrl) {
    const { fileName, uid: src, sizeType } = data;
    const extension = getImageFormat(src);
    const filter = isCropSize(data)
      ? getFilter({ ...defaultCrop, ...data.crop })
      : sizeType;

    if (extension) {
      // remove extension
      const uid = src.replace(`.${extension}`, "");

      if (fileName) {
        // remove extension for fileName
        // add extension from UID to fileName
        // the API is doesn't work with original .ext of file
        const fileNameExt = getImageFormat(fileName) ?? "";
        const _fileName = fileName.replace(`.${fileNameExt}`, "");
        const name = `${_fileName}.${extension}`;
        return [media.mediaResizeUrl, filter, uid, name].join("/");
      }

      const name = `image.${extension}`;
      return [media.mediaResizeUrl, filter, uid, name].join("/");
    }

    if (fileName) {
      return [media.mediaResizeUrl, filter, src, fileName].join("/");
    }

    return [media.mediaResizeUrl, filter, src].join("/");
  }

  return undefined;
};
