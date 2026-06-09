import * as Obj from "visual/utils/reader/object";
import { MigrationImageGallery } from "./types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

const IMAGE_MASK_KEY_PREFIX = "imagesMask";
const ITEM_MASK_KEY_PREFIX = "mask";

export const migrateItemsMaskFromGalleryMask = (
  model: Record<string, unknown>
): Record<string, unknown> => {
  const galleryMaskShape = model.imagesMaskShape;
  const items = model.items;

  if (
    !Array.isArray(items) ||
    !galleryMaskShape ||
    galleryMaskShape === "none"
  ) {
    return model;
  }

  // Read all gallery-level mask options once and map them to item-level keys.
  const galleryMaskEntries = Object.entries(model).filter(([key, value]) => {
    return key.startsWith(IMAGE_MASK_KEY_PREFIX) && value !== undefined;
  });

  if (!galleryMaskEntries.length) {
    return model;
  }

  let hasChanges = false;
  const migratedItems = items.map((itemModel) => {
    if (!Obj.isObject(itemModel)) {
      return itemModel;
    }

    if (itemModel.type !== ElementTypes.Image || !Obj.isObject(itemModel.value)) {
      return itemModel;
    }

    const itemValue = itemModel.value;

    // If item already has a dedicated mask shape, keep its own mask config untouched.
    if (itemValue.maskShape !== undefined) {
      return itemModel;
    }

    const nextValue = { ...itemValue };
    let itemChanged = false;

    for (const [sourceKey, sourceValue] of galleryMaskEntries) {
      const targetKey = sourceKey.replace(
        IMAGE_MASK_KEY_PREFIX,
        ITEM_MASK_KEY_PREFIX
      );

      // Never overwrite item-level values if they already exist.
      if (nextValue[targetKey] !== undefined) {
        continue;
      }

      nextValue[targetKey] = sourceValue;
      itemChanged = true;
    }

    if (!itemChanged) {
      return itemModel;
    }

    hasChanges = true;

    return {
      ...itemModel,
      value: nextValue
    };
  });

  if (!hasChanges) {
    return model;
  }

  return {
    ...model,
    items: migratedItems
  };
};

export const m2: MigrationImageGallery = {
  version: 2,
  cb({ v }) {
    if (!Obj.isObject(v)) {
      throw new Error(`ImageGallery migration failed ${v}`);
    }
    return migrateItemsMaskFromGalleryMask(v as Record<string, unknown>);
  }
};
