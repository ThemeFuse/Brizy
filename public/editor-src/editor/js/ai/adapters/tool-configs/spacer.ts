import { spacerPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const addSpacerConfig: AddToolConfig = {
  kind: "add",
  alias: "addSpacer",
  elementType: ElementTypes.Spacer,
  schema: spacerPropsSchema
};
export const updateSpacerConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateSpacer",
  elementType: ElementTypes.Spacer,
  schema: spacerPropsSchema
};
