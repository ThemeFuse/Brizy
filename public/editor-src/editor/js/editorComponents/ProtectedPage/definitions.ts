import { z } from "zod";
import {
  inferBorderRadiusType,
  restoreColorOpacity,
  validateFonts,
  withAllFontFamilyNormalize,
  withColorDefaults
} from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  fontFamilyPropertyPair,
  fontFamilySchemaPair,
  hexColor,
  opacity,
  plainText
} from "visual/ai/adapters/schema-primitives";
import type {
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { log } from "visual/ai/utils/logger";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";

export const protectedFormPropsSchema = z.object({
  // Content
  label: plainText.optional(),
  emptyMessage: plainText.optional(),
  invalidMessage: plainText.optional(),
  failMessage: plainText.optional(),

  // Layout
  width: z.number().min(10).max(100).optional(),
  inputWidth: z.number().min(1).max(100).optional(),
  inputHeight: z.number().min(1).max(100).optional(),
  inputSpacing: z.number().min(0).max(100).optional(),

  // Typography (of the password input text)
  ...fontFamilySchemaPair("typography"),
  typographyFontSize: z.number().min(1).max(200).optional(),
  typographyFontWeight: z.number().min(100).max(900).optional(),

  // Colors
  colorHex: hexColor,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,
  borderColorHex: hexColor,

  // Border
  borderWidth: z.number().min(0).max(50).optional(),
  borderRadius: z.number().min(0).optional(),

  hoverTransition: z.number().min(0).max(99).optional(),

  // Written by the defaults pipeline below, never exposed to the LLM (they
  // would eat into the 20-property budget). Zod strips undeclared keys, so
  // they have to live here or the normalization is silently dropped.
  colorPalette: colorPalette,
  bgColorPalette: colorPalette,
  borderColorPalette: colorPalette,
  typographyFontStyle: z.string().optional(),
  borderWidthType: z.enum(["grouped", "ungrouped"]).optional(),
  borderRadiusType: z.enum(["grouped", "ungrouped"]).optional()
});

export type ProtectedFormProps = z.infer<typeof protectedFormPropsSchema>;

/**
 * The stored typographyFontStyle is a global preset ("paragraph" by default) and
 * styleTypography2FontSize/FontWeight let that preset win over the element's own
 * values. Clear it so a custom size/weight actually renders. Menu does the same
 * for its un-prefixed typography; withAllFontFamilyNormalize already covers the
 * fontFamily case.
 */
const inferCustomTypography = <T extends Record<string, unknown>>(props: T): T =>
  ("typographyFontStyle" in props ||
    (props.typographyFontSize === undefined &&
      props.typographyFontWeight === undefined))
    ? props
    : { ...props, typographyFontStyle: "" };

/**
 * borderWidth is only read when borderWidthType is "grouped" (cssStyleBorder).
 * Per-side widths are not exposed, so a borderWidth edit always means "all
 * sides" — force the type in case the user left the toolbar on "ungrouped".
 */
const inferBorderWidthType = <T extends Record<string, unknown>>(props: T): T =>
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

const protectedFormPropertyDefinitions = {
  label: {
    type: "string",
    description: "Placeholder text shown inside the password input"
  },
  emptyMessage: {
    type: "string",
    description: "Error message shown when the form is submitted empty"
  },
  invalidMessage: {
    type: "string",
    description: "Error message shown when the password is wrong"
  },
  failMessage: {
    type: "string",
    description: "Error message shown when the request fails"
  },
  width: {
    type: "number",
    description:
      "Whole form width in percent (10-100). Same as Settings > Width in the toolbar.",
    minimum: 10,
    maximum: 100
  },
  inputWidth: {
    type: "number",
    description:
      "Password input width in percent of the form (1-100). Rest is the submit button.",
    minimum: 1,
    maximum: 100
  },
  inputHeight: {
    type: "number",
    description: "Password input height in pixels (1-100)",
    minimum: 1,
    maximum: 100
  },
  inputSpacing: {
    type: "number",
    description: "Gap between input and submit button in pixels (0-100)",
    minimum: 0,
    maximum: 100
  },
  ...fontFamilyPropertyPair(
    "typography",
    "Font family for the password input text. Call getProjectFonts first to verify it exists; never guess a name."
  ),
  typographyFontSize: {
    type: "number",
    description: "Password input font size in pixels (1-200)",
    minimum: 1,
    maximum: 200
  },
  typographyFontWeight: {
    type: "number",
    description: "Password input font weight (100-900)",
    minimum: 100,
    maximum: 900
  },
  colorHex: {
    type: "string",
    description: "Password text and placeholder color hex (e.g. '#000000')"
  },
  bgColorHex: {
    type: "string",
    description: "Password input background color hex. Opacity is auto-restored."
  },
  bgColorOpacity: {
    type: "number",
    description: "Input background opacity (0-1), for a semi-transparent input",
    minimum: 0,
    maximum: 1
  },
  borderColorHex: {
    type: "string",
    description: "Password input border color hex (e.g. '#dcdee1')"
  },
  borderWidth: {
    type: "number",
    description: "Input border width in pixels, all sides (0-50)",
    minimum: 0,
    maximum: 50
  },
  borderRadius: {
    type: "number",
    description:
      "Input corner radius in pixels, all corners. Same as Corner in the sidebar.",
    minimum: 0
  },
  hoverTransition: {
    type: "number",
    description: "Hover transition duration in milliseconds (0-99)",
    minimum: 0,
    maximum: 99
  }
} as const;

export const updateProtectedFormDefinition: ToolDefinition = {
  name: "updateProtectedForm",
  strict: true,
  description:
    "Update the Protected Form — the password gate that unlocks a password-protected page. Use searchElements({type:'ProtectedPage'}) to find the ID. For its submit button use updateButton; for a sign-in form use updateLogin; for the form's page alignment use updateWrapper on the parent.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the ProtectedPage element to update"
      },
      ...protectedFormPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const updateProtectedFormConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateProtectedFormDefinition,
  elementType: ElementTypes.ProtectedPage,
  schema: protectedFormPropsSchema,
  defaults: withProtectedFormDefaults,
  // Custom handler (Login/Button precedent): beforeUpdate cannot return an
  // error, and validateFonts must be able to reject an unknown font family.
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateProtectedForm input %o", args);
    const { elementId, ...props } = args;

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
      const el = deps.pageRepository.getElementById(elementId as string);
      if (el.success && el.data) {
        changes = restoreColorOpacity(
          el.data.value as Record<string, unknown>,
          changes
        );
      }
    }

    const result = deps.pageRepository.updateElement({
      elementId: elementId as string,
      elementType: ElementTypes.ProtectedPage,
      changes
    });
    log.tools("updateProtectedForm output %o", result);
    return result;
  }
};
