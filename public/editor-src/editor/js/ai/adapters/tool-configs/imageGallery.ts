import { imageGalleryPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withImageGalleryDefaults = withAllFontFamilyNormalize;
export const addImageGalleryConfig: AddToolConfig = {
  kind: "add",
  alias: "addImageGallery",
  elementType: ElementTypes.ImageGallery,
  schema: imageGalleryPropsSchema,
  defaults: withImageGalleryDefaults
};
export const updateImageGalleryConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateImageGallery",
  elementType: ElementTypes.ImageGallery,
  schema: imageGalleryPropsSchema,
  defaults: withImageGalleryDefaults
};
