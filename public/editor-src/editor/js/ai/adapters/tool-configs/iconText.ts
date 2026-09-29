import { iconTextPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const addIconTextConfig: AddToolConfig = {
  kind: "add",
  alias: "addIconText",
  elementType: ElementTypes.IconText,
  schema: iconTextPropsSchema
};
export const updateIconTextConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateIconText",
  elementType: ElementTypes.IconText,
  schema: iconTextPropsSchema
};
