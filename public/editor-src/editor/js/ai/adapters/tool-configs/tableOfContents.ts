import { tableOfContentsPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import {
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withTableOfContentsDefaults = pipe(
  withColorDefaults,
  withAllFontFamilyNormalize
);
export const addTableOfContentsConfig: AddToolConfig = {
  kind: "add",
  alias: "addTableOfContents",
  elementType: ElementTypes.TableOfContents,
  schema: tableOfContentsPropsSchema,
  defaults: withTableOfContentsDefaults
};
export const updateTableOfContentsConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateTableOfContents",
  elementType: ElementTypes.TableOfContents,
  schema: tableOfContentsPropsSchema,
  defaults: withTableOfContentsDefaults
};
