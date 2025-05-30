import { flowRight } from "es-toolkit";
import { ElementModelType } from "visual/component/Elements/Types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Screenshot } from "visual/types/Screenshot";
import {
  isAbsoluteUrl,
  objectToQueryString,
  urlContainsQueryString
} from "visual/utils/url";
import { placeholderBlockThumbnailUrl } from "./placeholderBlockThumbnailUrl";

interface Thumbnail extends ElementModelType {
  meta?: Partial<Screenshot>;
}

interface Data {
  url: string;
  width: number;
  height: number;
}

type WithScreenshotUrl<T> = T & {
  screenshotUrl: string;
};

interface BlockThumbnailData {
  block: Thumbnail;
  config: ConfigCommon;
  screenshot?: string;
}

export const blockThumbnailData = (args: BlockThumbnailData): Data => {
  const { block, config, screenshot } = args;

  const screenshotData = screenshot
    ? blockScreenshotData(block, screenshot)
    : null;

  let data;

  // 1. see if it has a screenshot
  // 2. show placeholder
  if (screenshotData) {
    data = screenshotData;
  } else {
    data = {
      url: placeholderBlockThumbnailUrl(config),
      width: 500,
      height: 200
    };
  }

  return data;
};

const getScreenshots = (block: Thumbnail): Partial<Screenshot> =>
  block.meta || (block.value as Partial<Screenshot>) || {};

function blockScreenshotData(
  block: Thumbnail,
  screenshotUrl: string
): Data | null {
  const { _thumbnailSrc, _thumbnailWidth, _thumbnailHeight } =
    getScreenshots(block);

  if (_thumbnailSrc && _thumbnailWidth && _thumbnailHeight) {
    if (isAbsoluteUrl(_thumbnailSrc)) {
      return {
        url: _thumbnailSrc,
        width: _thumbnailWidth,
        height: _thumbnailHeight
      };
    }

    const getUrl = flowRight(
      (block: WithScreenshotUrl<Screenshot>) =>
        blockScreenshotUrl({ ...block, screenshotUrl }),
      getScreenshots
    );

    return {
      url: getUrl(block),
      width: _thumbnailWidth,
      height: _thumbnailHeight
    };
  }

  return null;
}

function blockScreenshotUrl({
  _thumbnailSrc,
  _thumbnailTime,
  screenshotUrl
}: WithScreenshotUrl<Screenshot>): string {
  const qs = objectToQueryString({
    t: _thumbnailTime || Date.now()
  });

  const blockUrl = `${screenshotUrl}${_thumbnailSrc}`;

  return urlContainsQueryString(blockUrl)
    ? `${blockUrl}&${qs}`
    : `${blockUrl}?${qs}`;
}
