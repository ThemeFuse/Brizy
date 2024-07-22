import { isObject } from "visual/utils/reader/object";

export const isNotClonedFromGallery = (v: Record<string, unknown>): boolean => {
  return isObject(v.value) && !v.value.clonedFromGallery;
};
