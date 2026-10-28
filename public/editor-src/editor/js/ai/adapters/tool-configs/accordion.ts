import { accordionPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { withAllFontFamilyNormalize } from "../prop-defaults";
import type { AddToolConfig, UpdateToolConfig } from "../types";

export const withAccordionDefaults = withAllFontFamilyNormalize;
export const addAccordionConfig: AddToolConfig = {
  kind: "add",
  alias: "addAccordion",
  elementType: ElementTypes.Accordion,
  schema: accordionPropsSchema,
  defaults: withAccordionDefaults
};
export const updateAccordionConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateAccordion",
  elementType: ElementTypes.Accordion,
  schema: accordionPropsSchema,
  defaults: withAccordionDefaults
};
