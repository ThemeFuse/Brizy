import { timelinePropsSchema, timelineTabPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import {
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withTimelineDefaults = pipe(
  withColorDefaults,
  withAllFontFamilyNormalize
);
export const withTimelineTabDefaults = withColorDefaults;
export const addTimelineConfig: AddToolConfig = {
  kind: "add",
  alias: "addTimeline",
  elementType: ElementTypes.Timeline,
  schema: timelinePropsSchema,
  defaults: withTimelineDefaults
};
export const updateTimelineConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateTimeline",
  elementType: ElementTypes.Timeline,
  schema: timelinePropsSchema,
  defaults: withTimelineDefaults
};
export const addTimelineItemConfig: AddToolConfig = {
  kind: "add",
  alias: "addTimelineItem",
  elementType: ElementTypes.TimelineTab,
  schema: timelineTabPropsSchema,
  defaults: withTimelineTabDefaults
};
export const updateTimelineItemConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateTimelineItem",
  elementType: ElementTypes.TimelineTab,
  schema: timelineTabPropsSchema,
  defaults: withTimelineTabDefaults
};
