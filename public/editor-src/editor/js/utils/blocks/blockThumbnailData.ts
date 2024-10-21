import { produce } from "immer";
import _ from "underscore";
import { ElementModelType } from "visual/component/Elements/Types";
import Config from "visual/global/Config";
import {
  globalBlocksAssembledSelector,
  screenshotsSelector
} from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Screenshot } from "visual/types";
import { read as readStr } from "visual/utils/reader/string";
import {
  isAbsoluteUrl,
  objectToQueryString,
  urlContainsQueryString
} from "visual/utils/url";
import { placeholderBlockThumbnailUrl } from "./placeholderBlockThumbnailUrl";

interface Thumbnail extends ElementModelType {
  meta?: Partial<Screenshot>;
}

interface Options {
  searchScreenshotInStoreFirst?: boolean;
}

interface Data {
  url: string;
  width: number;
  height: number;
}

export const blockThumbnailData = (
  block: Thumbnail,
  options: Options = {}
): Data => {
  const screenshotData = blockScreenshotData(block, options);
  let data;

  // 1. see if it has a screenshot
  // 2. show placeholder
  if (screenshotData) {
    data = screenshotData;
  } else {
    data = {
      url: placeholderBlockThumbnailUrl(),
      width: 500,
      height: 200
    };
  }

  return data;
};

const getScreenshots = (block: Thumbnail): Partial<Screenshot> =>
  block.meta || (block.value as Partial<Screenshot>) || {};

function blockScreenshotData(block: Thumbnail, options: Options): Data | null {
  const blockId = readStr(block.value?._id);

  if (blockId && block.type === "GlobalBlock") {
    const globalBlock = globalBlocksAssembledSelector(getStore().getState())[
      blockId
    ];

    if (globalBlock) {
      block = {
        ...globalBlock.data,
        meta: block.meta
      };
    }
  }

  if (blockId && options.searchScreenshotInStoreFirst === true) {
    const screenshots = screenshotsSelector(getStore().getState());

    if (screenshots[blockId]) {
      block = produce(block, (draft) => {
        draft.meta = { ...draft.meta, ...screenshots[blockId] };
      });
    }
  }
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

    const getUrl = _.compose(
      TARGET === "WP" ? blockScreenshotUrlWP : blockScreenshotUrlCloud,
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

function blockScreenshotUrlCloud({
  _thumbnailSrc,
  _thumbnailTime
}: Screenshot): string {
  const screenshotUrl = Config.get("urls").screenshot;
  const qs = objectToQueryString({
    t: _thumbnailTime || Date.now()
  });

  return `${screenshotUrl}/${_thumbnailSrc}?${qs}`;
}

function blockScreenshotUrlWP({
  _thumbnailSrc,
  _thumbnailTime
}: Screenshot): string {
  const siteUrl = Config.get("urls").site;
  const page = Config.get("wp").page;
  const prefix = Config.get("prefix") ?? "brizy";
  const qs = objectToQueryString({
    [`${prefix}_post`]: page,
    [`${prefix}_block_screenshot`]: _thumbnailSrc,
    t: _thumbnailTime || Date.now()
  });

  return urlContainsQueryString(siteUrl)
    ? `${siteUrl}&${qs}`
    : `${siteUrl}?${qs}`;
}
