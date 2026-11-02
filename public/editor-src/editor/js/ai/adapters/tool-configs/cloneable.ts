import { cloneablePropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { UpdateToolConfig } from "../types";

export const updateCloneableConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateCloneable",
  elementType: ElementTypes.Cloneable,
  schema: cloneablePropsSchema
};
