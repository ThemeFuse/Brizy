import { embedCodePropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const addEmbedCodeConfig: AddToolConfig = {
  kind: "add",
  alias: "addEmbedCode",
  elementType: ElementTypes.EmbedCode,
  schema: embedCodePropsSchema
};
export const updateEmbedCodeConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateEmbedCode",
  elementType: ElementTypes.EmbedCode,
  schema: embedCodePropsSchema
};
