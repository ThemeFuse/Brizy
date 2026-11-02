import { postNavigationPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

// Every colour ships at opacity 1, so no beforeUpdate is needed to restore one
// (unlike ResetPassword's transparent boxes).
const withPostNavigationDefaults = (props: Record<string, unknown>) =>
  withAllFontFamilyNormalize(withColorDefaults(props));

export const addPostNavigationConfig: AddToolConfig = {
  kind: "add",
  alias: "addPostNavigation",
  elementType: ElementTypes.PostNavigation,
  schema: postNavigationPropsSchema,
  defaults: withPostNavigationDefaults
};

export const updatePostNavigationConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updatePostNavigation",
  elementType: ElementTypes.PostNavigation,
  schema: postNavigationPropsSchema,
  defaults: withPostNavigationDefaults
};
