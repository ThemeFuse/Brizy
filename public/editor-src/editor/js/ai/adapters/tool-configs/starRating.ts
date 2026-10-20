import { starRatingPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withStarRatingDefaults = withAllFontFamilyNormalize;
export const addStarRatingConfig: AddToolConfig = {
  kind: "add",
  alias: "addStarRating",
  elementType: ElementTypes.StarRating,
  schema: starRatingPropsSchema,
  defaults: withStarRatingDefaults
};
export const updateStarRatingConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateStarRating",
  elementType: ElementTypes.StarRating,
  schema: starRatingPropsSchema,
  defaults: withStarRatingDefaults
};
