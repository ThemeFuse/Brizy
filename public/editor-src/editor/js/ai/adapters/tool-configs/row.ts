import { rowPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import {
  inferBgColorType,
  withAnimatedGradientDefaults,
  withColorDefaults
} from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withRowDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults
);
export const addRowConfig: AddToolConfig = {
  kind: "add",
  alias: "addRow",
  elementType: ElementTypes.Row,
  schema: rowPropsSchema,
  defaults: withRowDefaults
};
export const updateRowConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateRow",
  elementType: ElementTypes.Row,
  schema: rowPropsSchema,
  defaults: withRowDefaults
};
