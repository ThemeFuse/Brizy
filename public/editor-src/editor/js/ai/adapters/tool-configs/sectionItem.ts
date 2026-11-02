import { sectionItemPropsSchema } from "@brizy/ai-tools";
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

export const withSectionItemDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults,
  inferPaddingType,
  inferBorderRadiusType
);
export const updateSectionItemConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateSectionItem",
  elementType: ElementTypes.SectionItem,
  schema: sectionItemPropsSchema,
  defaults: withSectionItemDefaults,
  validateType: {
    expectedType: ElementTypes.SectionItem,
    errorMessage:
      // biome-ignore lint/suspicious/noTemplateCurlyInString: the literal token handler-factory replaces with the real type at runtime, not an interpolation
      "Background and padding properties can only be applied to SectionItem, not ${type}. For Section blocks, find the SectionItem child element inside the Section using getPageStructure and use its ID instead."
  }
};
