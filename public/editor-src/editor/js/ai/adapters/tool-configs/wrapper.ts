import { wrapperPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { UpdateToolConfig } from "../types";

export const updateWrapperConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateWrapper",
  elementType: ElementTypes.Wrapper,
  schema: wrapperPropsSchema
};
