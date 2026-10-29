import { sectionFooterPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";
import {
  inferBgColorType,
  withAnimatedGradientDefaults,
  withColorDefaults
} from "../prop-defaults";
import type { UpdateToolConfig } from "../types";

export const withSectionFooterDefaults = pipe(
  withColorDefaults,
  inferBgColorType,
  withAnimatedGradientDefaults
);
export const updateSectionFooterConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateSectionFooter",
  elementType: ElementTypes.SectionFooter,
  schema: sectionFooterPropsSchema,
  defaults: withSectionFooterDefaults,
  validateType: {
    expectedType: ElementTypes.SectionFooter,
    errorMessage:
      // biome-ignore lint/suspicious/noTemplateCurlyInString: the literal token handler-factory replaces with the real type at runtime, not an interpolation
      "updateSectionFooter can only be used on SectionFooter elements, not ${type}. Use updateSectionItem for regular Section blocks."
  }
};
