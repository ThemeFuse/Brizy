import { videoPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { detectVideoType } from "visual/utils/video";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withVideoDefaults = withAllFontFamilyNormalize;
export const addVideoConfig: AddToolConfig = {
  kind: "add",
  alias: "addVideo",
  elementType: ElementTypes.Video,
  schema: videoPropsSchema,
  defaults: withVideoDefaults,
  transformProps: (parsed) => {
    const initialProperties = { ...parsed };
    if (parsed.video) {
      initialProperties.type = detectVideoType(parsed.video as string);
    }
    return initialProperties;
  }
};
export const updateVideoConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateVideo",
  elementType: ElementTypes.Video,
  schema: videoPropsSchema,
  defaults: withVideoDefaults,
  transformProps: (parsed) => {
    const changes = { ...parsed };
    if (parsed.video) {
      changes.type = detectVideoType(parsed.video as string);
    }
    return changes;
  }
};
