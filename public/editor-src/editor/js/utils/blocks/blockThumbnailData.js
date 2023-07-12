import produce from "immer";
import _ from "underscore";
import Config from "visual/global/Config";
import {
  globalBlocksAssembledSelector,
  screenshotsSelector
} from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import {
  isAbsoluteUrl,
  objectToQueryString,
  urlContainsQueryString
} from "visual/utils/url";
import { placeholderBlockThumbnailUrl } from "./placeholderBlockThumbnailUrl";

export const blockThumbnailData = (block, options = {}) => {
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

const getScreenshots = (block) => block.meta || block.value || {};

function blockScreenshotData(block, options) {
  if (block.type === "GlobalBlock") {
    block = globalBlocksAssembledSelector(getStore().getState())[
      block.value._id
    ];
    block = {
      ...block.data,
      meta: block.meta
    };
  }

  if (options.searchScreenshotInStoreFirst === true) {
    const screenshots = screenshotsSelector(getStore().getState());

    if (screenshots[block.value._id]) {
      block = produce(block, (draft) => {
        draft.meta = { ...draft.meta, ...screenshots[block.value._id] };
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

function blockScreenshotUrlCloud({ _thumbnailSrc, _thumbnailTime }) {
  const screenshotUrl = Config.get("urls").screenshot;
  const qs = objectToQueryString({
    t: _thumbnailTime || Date.now()
  });

  return `${screenshotUrl}/${_thumbnailSrc}?${qs}`;
}

function blockScreenshotUrlWP({ _thumbnailSrc, _thumbnailTime }) {
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
