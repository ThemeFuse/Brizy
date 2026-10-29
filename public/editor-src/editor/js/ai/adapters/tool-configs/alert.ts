import { alertPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import {
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withAlertDefaults = pipe(
  withColorDefaults,
  withAllFontFamilyNormalize
);
export const addAlertConfig: AddToolConfig = {
  kind: "add",
  alias: "addAlert",
  elementType: ElementTypes.Alert,
  schema: alertPropsSchema,
  defaults: withAlertDefaults
};
export const updateAlertConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateAlert",
  elementType: ElementTypes.Alert,
  schema: alertPropsSchema,
  defaults: withAlertDefaults
};
