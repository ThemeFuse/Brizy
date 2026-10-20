import { sectionHeaderItemPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import {
  inferBgColorType,
  inferBorderRadiusType,
  inferPaddingType,
  withAnimatedGradientDefaults,
  withColorDefaults
} from "../prop-defaults";
import type { UpdateToolConfig } from "../types";

export const withSectionHeaderItemDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults,
  inferPaddingType,
  inferBorderRadiusType
);
export const updateSectionHeaderItemConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateSectionHeaderItem",
  elementType: ElementTypes.SectionHeaderItem,
  schema: sectionHeaderItemPropsSchema,
  defaults: withSectionHeaderItemDefaults,
  validateType: {
    expectedType: ElementTypes.SectionHeaderItem,
    errorMessage:
      // biome-ignore lint/suspicious/noTemplateCurlyInString: the literal token handler-factory replaces with the real type at runtime, not an interpolation
      "Background and styling properties can only be applied to SectionHeaderItem, not ${type}. For SectionHeader blocks, find the SectionHeaderItem child using getPageStructure and use its ID instead."
  }
};
export const updateSectionHeaderStickyItemConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateSectionHeaderStickyItem",
  elementType: ElementTypes.SectionHeaderStickyItem,
  schema: sectionHeaderItemPropsSchema,
  defaults: withSectionHeaderItemDefaults,
  validateType: {
    expectedType: ElementTypes.SectionHeaderStickyItem,
    errorMessage:
      // biome-ignore lint/suspicious/noTemplateCurlyInString: the literal token handler-factory replaces with the real type at runtime, not an interpolation
      "Background and styling properties can only be applied to SectionHeaderStickyItem, not ${type}. For sticky header styling, find the SectionHeaderStickyItem child using getPageStructure and use its ID instead."
  }
};
