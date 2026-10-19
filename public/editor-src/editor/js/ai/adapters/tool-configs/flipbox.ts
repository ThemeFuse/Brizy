import { flipboxPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withColorDefaults } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withFlipboxDefaults = withColorDefaults;
export const addFlipboxConfig: AddToolConfig = {
  kind: "add",
  alias: "addFlipbox",
  elementType: ElementTypes.Flipbox,
  schema: flipboxPropsSchema,
  defaults: withFlipboxDefaults
};
export const updateFlipboxConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateFlipbox",
  elementType: ElementTypes.Flipbox,
  schema: flipboxPropsSchema,
  defaults: withFlipboxDefaults
};
