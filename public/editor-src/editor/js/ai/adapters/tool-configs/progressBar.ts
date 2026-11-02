import { progressBarPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withProgressBarDefaults = withAllFontFamilyNormalize;
export const addProgressBarConfig: AddToolConfig = {
  kind: "add",
  alias: "addProgressBar",
  elementType: ElementTypes.ProgressBar,
  schema: progressBarPropsSchema,
  defaults: withProgressBarDefaults
};
export const updateProgressBarConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateProgressBar",
  elementType: ElementTypes.ProgressBar,
  schema: progressBarPropsSchema,
  defaults: withProgressBarDefaults
};
