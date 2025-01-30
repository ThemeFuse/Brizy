import { SavedBlock } from "visual/types";
import { Block } from "visual/types/Block";
import {
  createBlockScreenshot,
  createSavedBlock,
  createSavedPopup
} from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { isNumber } from "visual/utils/math";
import { findDeep } from "visual/utils/object";
import { isObject } from "visual/utils/reader/object";
import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import { uuid } from "visual/utils/uuid";
import { Error, GetBlock, HandleCreateBlock, Warn } from "./types";

export const isError = (e: unknown): e is Error => {
  return isObject(e) && e.type === "error";
};

export const isWarn = (e: unknown): e is Warn => {
  return isObject(e) && e.type === "warn";
};

const hasBlock = ({ value }: Block, id: string): boolean => {
  return !!value && value._id === id;
};

export const getBlock = ({
  pageItems,
  blockId,
  blockType
}: GetBlock): Block | undefined | null => {
  let block;
  if (blockType === "normal") {
    block = pageItems.find((block: Block) => hasBlock(block, blockId));
  } else {
    block = findDeep(pageItems, (obj: Block) => hasBlock(obj, blockId)).obj;
  }

  return block;
};

export const handleCreateSaveBlock = async ({
  block,
  blockType,
  blockId,
  extraFontStyles,
  config
}: HandleCreateBlock): Promise<void> => {
  const meta: SavedBlock["meta"] = {
    extraFontStyles,
    type: blockType,
    ...block.meta
  };

  let screenshotsSupported: boolean;

  try {
    screenshotsSupported = await browserSupports();
  } catch (e) {
    screenshotsSupported = false;
  }

  if (screenshotsSupported) {
    // getElementById instead of querySelector was used deliberately
    // because querySelector(`#{id}`) throws when using ids that start with a number
    const node: HTMLElement | null = document.getElementById(blockId);

    if (node) {
      const { src, width, height } = await makeNodeScreenshot(
        node,
        config
      ).catch(() => ({
        src: undefined,
        width: undefined,
        height: undefined
      }));

      if (src && isNumber(width) && isNumber(height)) {
        const { id } = await createBlockScreenshot(
          { base64: src, blockType: "saved" },
          config
        ).catch(() => ({ id: undefined }));

        if (id) {
          meta._thumbnailSrc = id;
          meta._thumbnailWidth = width;
          meta._thumbnailHeight = height;
          meta._thumbnailTime = Date.now();
        }
      }
    }
  }

  const data = {
    data: block,
    meta,
    uid: uuid(),
    dataVersion: 1
  };

  switch (blockType) {
    case "normal": {
      try {
        await createSavedBlock(data, config);
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }
        throw {
          message: t("Could not Create Saved Block"),
          type: "error"
        };
      }
      break;
    }
    case "popup": {
      try {
        await createSavedPopup(data, config);
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error(e);
        }
        throw {
          message: t("Could not Create Saved Popup"),
          type: "error"
        };
      }
      break;
    }
  }

  if (!screenshotsSupported) {
    throw {
      message: t(
        "Your block was saved without screenshot, browser is not compatible"
      ),
      type: "warn",
      hideAfter: 5
    };
  }
};
