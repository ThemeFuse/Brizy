import { tabsPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withTabsDefaults = withAllFontFamilyNormalize;
export const addTabsConfig: AddToolConfig = {
  kind: "add",
  alias: "addTabs",
  elementType: ElementTypes.Tabs,
  schema: tabsPropsSchema,
  defaults: withTabsDefaults
};
export const updateTabsConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateTabs",
  elementType: ElementTypes.Tabs,
  schema: tabsPropsSchema,
  defaults: withTabsDefaults
};
