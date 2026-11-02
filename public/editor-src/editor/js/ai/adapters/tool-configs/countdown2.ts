import { countdown2PropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withCountdownDefaults = withAllFontFamilyNormalize;
export const addCountdownConfig: AddToolConfig = {
  kind: "add",
  alias: "addCountdown",
  elementType: ElementTypes.Countdown2,
  schema: countdown2PropsSchema,
  defaults: withCountdownDefaults
};
export const updateCountdownConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateCountdown",
  elementType: ElementTypes.Countdown2,
  schema: countdown2PropsSchema,
  defaults: withCountdownDefaults
};
