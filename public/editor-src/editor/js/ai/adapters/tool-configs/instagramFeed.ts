import { instagramFeedPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { AddToolConfig, UpdateToolConfig } from "../types";

// No colours, fonts or render flags, so no defaults: the parsed patch is stored as sent.
export const addInstagramFeedConfig: AddToolConfig = {
  kind: "add",
  alias: "addInstagramFeed",
  elementType: ElementTypes.InstagramFeed,
  schema: instagramFeedPropsSchema
};

export const updateInstagramFeedConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateInstagramFeed",
  elementType: ElementTypes.InstagramFeed,
  schema: instagramFeedPropsSchema
};
