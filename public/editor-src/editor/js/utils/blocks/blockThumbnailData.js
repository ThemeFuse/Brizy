import Config from "visual/global/Config";
import { getStore } from "visual/redux/store";
import { urlContainsQueryString, objectToQueryString } from "visual/utils/url";
import { assetUrl } from "visual/utils/asset";
import { placeholderBlockThumbnailUrl } from "./placeholderBlockThumbnailUrl";
import {
  globalBlocksAssembledSelector,
  screenshotsSelector
} from "visual/redux/selectors";

export const blockThumbnailData = (block, options = {}) => {
  const screenshotData = blockScreenshotData(block, options);
  let data;

  // 1. see if it has a screenshot
  // 2. see if it has a default thumbnail
  // 3. show placeholder
  if (screenshotData) {
    data = screenshotData;
  } else {
    const { blocksThumbnailSizes } = getStore().getState();
    const thumbSizes = blocksThumbnailSizes[block.blockId];

    if (thumbSizes) {
      const configUrl = Config.get("urls").blockThumbnails;

      data = {
        url: configUrl
          ? `${configUrl}/${block.blockId}.jpg`
          : assetUrl(`thumbs/${block.blockId}.jpg`),
        width: thumbSizes[0],
        height: thumbSizes[1]
      };
    } else {
      data = {
        url: placeholderBlockThumbnailUrl(),
        width: 500,
        height: 200
      };
    }
  }

  return data;
};

function blockScreenshotData(block, options) {
  if (block.type === "GlobalBlock") {
    block = globalBlocksAssembledSelector(getStore().getState())[
      block.value.globalBlockId
    ].data;
  }

  if (options.searchScreenshotInStoreFirst === true) {
    const screenshots = screenshotsSelector(getStore().getState());

    if (screenshots[block.value._id]) {
      block = {
        ...block,
        value: {
          ...block.value,
          ...screenshots[block.value._id]
        }
      };
    }
  }

  const { _thumbnailSrc, _thumbnailWidth, _thumbnailHeight } = block.value;

  if (_thumbnailSrc && _thumbnailWidth && _thumbnailHeight) {
    return {
      url:
        TARGET === "WP"
          ? blockScreenshotUrlWP(block)
          : blockScreenshotUrlCloud(block),
      width: _thumbnailWidth,
      height: _thumbnailHeight
    };
  }

  return null;
}

function blockScreenshotUrlCloud(block) {
  const { _thumbnailSrc, _thumbnailTime } = block.value;
  const screenshotUrl = Config.get("urls").screenshot;
  const qs = objectToQueryString({
    t: _thumbnailTime || Date.now()
  });

  return `${screenshotUrl}/${_thumbnailSrc}?${qs}`;
}

function blockScreenshotUrlWP(block) {
  const { _thumbnailSrc, _thumbnailTime } = block.value;
  const siteUrl = Config.get("urls").site;
  const page = Config.get("wp").page;
  const qs = objectToQueryString({
    brizy_post: page,
    brizy_block_screenshot: _thumbnailSrc,
    t: _thumbnailTime || Date.now()
  });

  return urlContainsQueryString(siteUrl)
    ? `${siteUrl}&${qs}`
    : `${siteUrl}?${qs}`;
}
