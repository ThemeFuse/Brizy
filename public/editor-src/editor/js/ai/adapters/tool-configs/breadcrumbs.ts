import { breadcrumbsPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withColorDefaults } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withBreadcrumbsDefaults = withColorDefaults;
export const addBreadcrumbsConfig: AddToolConfig = {
  kind: "add",
  alias: "addBreadcrumbs",
  elementType: ElementTypes.Breadcrumbs,
  schema: breadcrumbsPropsSchema,
  defaults: withBreadcrumbsDefaults
};
export const updateBreadcrumbsConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateBreadcrumbs",
  elementType: ElementTypes.Breadcrumbs,
  schema: breadcrumbsPropsSchema,
  defaults: withBreadcrumbsDefaults
};
