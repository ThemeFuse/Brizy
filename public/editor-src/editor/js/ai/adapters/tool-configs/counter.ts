import { counterPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withCounterDefaults = withAllFontFamilyNormalize;
export const addCounterConfig: AddToolConfig = {
  kind: "add",
  alias: "addCounter",
  elementType: ElementTypes.Counter,
  schema: counterPropsSchema,
  defaults: withCounterDefaults
};
export const updateCounterConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateCounter",
  elementType: ElementTypes.Counter,
  schema: counterPropsSchema,
  defaults: withCounterDefaults
};
