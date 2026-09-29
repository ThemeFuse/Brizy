import { elementIdSchema, protectedFormPropsSchema } from "@brizy/ai-tools";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { log } from "../../utils/logger";
import {
  inferBorderRadiusType,
  restoreColorOpacity,
  validateFonts,
  withAllFontFamilyNormalize,
  withColorDefaults
} from "../prop-defaults";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "../types";

/**
 * The stored typographyFontStyle is a global preset ("paragraph" by default) and
 * styleTypography2FontSize/FontWeight let that preset win over the element's own
 * values. Clear it so a custom size/weight actually renders. Menu does the same
 * for its un-prefixed typography; withAllFontFamilyNormalize already covers the
 * fontFamily case.
 */
const inferCustomTypography = <T extends Record<string, unknown>>(
  props: T
): T =>
  "typographyFontStyle" in props ||
  (props.typographyFontSize === undefined &&
    props.typographyFontWeight === undefined)
    ? props
    : { ...props, typographyFontStyle: "" };
/**
 * borderWidth is only read when borderWidthType is "grouped" (cssStyleBorder).
 * Per-side widths are not exposed, so a borderWidth edit always means "all
 * sides" — force the type in case the user left the toolbar on "ungrouped".
 */
const inferBorderWidthType = <T extends Record<string, unknown>>(
  props: T
): T =>
  "borderWidthType" in props || props.borderWidth === undefined
    ? props
    : { ...props, borderWidthType: "grouped" };
export const withProtectedFormDefaults = (props: Record<string, unknown>) =>
  inferBorderWidthType(
    inferBorderRadiusType(
      inferCustomTypography(
        withAllFontFamilyNormalize(withColorDefaults(props))
      )
    )
  );
export const updateProtectedFormConfig: UpdateToolConfig = {
  kind: "update",
  alias: "updateProtectedForm",
  elementType: ElementTypes.ProtectedPage,
  schema: protectedFormPropsSchema,
  defaults: withProtectedFormDefaults,
  // Custom handler (Login/Button precedent): beforeUpdate cannot return an
  // error, and validateFonts must be able to reject an unknown font family.
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateProtectedForm input %o", args);
    const { elementId, ...props } = args;

    const elementIdParsed = elementIdSchema.safeParse(elementId);
    if (!elementIdParsed.success) {
      return { success: false, error: elementIdParsed.error.message };
    }

    const propsWithDefaults = withProtectedFormDefaults(props);
    const parsed = protectedFormPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    let changes: Record<string, unknown> = parsed.data;

    // bgColor ships with opacity 0 / tempBgColorOpacity 1 (the toolbar's "no
    // background" state), so a hex-only edit would change nothing on screen.
    if (Object.keys(changes).some((k) => k.endsWith("Hex"))) {
      const el = deps.pageRepository.getElementById(elementIdParsed.data);
      if (el.success && el.data) {
        changes = restoreColorOpacity(
          el.data.value as Record<string, unknown>,
          changes
        );
      }
    }

    const result = deps.pageRepository.updateElement({
      elementId: elementIdParsed.data,
      elementType: ElementTypes.ProtectedPage,
      changes
    });
    log.tools("updateProtectedForm output %o", result);
    return result;
  }
};

// Declarative: createAddHandler already validates containerId/insertIndex and
// runs inferStoredFlags, which is what writes the flags schema.ts keeps for the
// normalization. The add tool exposes no font property, so there is nothing for
// validateFonts to reject and no reason for the handler escape hatch here.
export const addProtectedFormConfig: AddToolConfig = {
  kind: "add",
  alias: "addProtectedForm",
  elementType: ElementTypes.ProtectedPage,
  schema: protectedFormPropsSchema,
  defaults: withProtectedFormDefaults
};
