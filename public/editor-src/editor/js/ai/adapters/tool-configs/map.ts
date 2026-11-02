import { mapPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const addMapConfig: AddToolConfig = {
  kind: "add",
  alias: "addMap",
  elementType: ElementTypes.Map,
  schema: mapPropsSchema
};
export const updateMapConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateMap",
  elementType: ElementTypes.Map,
  schema: mapPropsSchema
};
