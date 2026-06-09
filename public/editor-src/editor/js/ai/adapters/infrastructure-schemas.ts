import { z } from "zod";
import { hexColorRequired } from "./schema-primitives";

/**
 * Zod schemas for infrastructure tool handler argument validation.
 *
 * These mirror the JSON Schemas in `infrastructure-definitions.ts` but run at
 * runtime — the LLM (or any caller) does not always honor the declared schema,
 * so handlers validate args before touching the repositories.
 *
 * Unknown keys are stripped (zod default), so extra props never cause failures.
 * Failures return `{ success: false, error: parsed.error.message }` — matching
 * the component handler factory in `handler-factory.ts`.
 */

// ===========================================
// Shared primitives
// ===========================================

const nonNegativeIndex = z.number().int().min(0);
const blockTypeEnum = z.enum(["Section", "SectionHeader", "SectionFooter"]);

// ===========================================
// READ TOOLS
// ===========================================

export const getPageStructureSchema = z.object({
  depth: z.number().int().min(1).optional()
});

export const getElementByIdSchema = z.object({
  elementId: z.string().min(1, "elementId is required")
});

export const searchElementsSchema = z.object({
  type: z.string().min(1).optional(),
  typeRegex: z.string().min(1).optional(),
  containsText: z.string().min(1).optional(),
  textRegex: z.string().min(1).optional(),
  blockId: z.string().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
});

export const getAvailableIconsSchema = z.object({
  iconType: z.enum(["outline", "glyph", "fa"]).optional(),
  search: z.string().min(1).optional(),
  limit: z.number().int().min(1).max(200).optional()
});

export const getGoogleFontsSchema = z.object({
  search: z.string().min(1, "search is required"),
  limit: z.number().int().min(1).max(100).optional()
});

// ===========================================
// BLOCK TOOLS
// ===========================================

const addBlockEntrySchema = z.object({
  blockType: blockTypeEnum,
  blockRef: z.string().min(1).optional(),
  blockData: z.record(z.unknown()).optional(),
  insertIndex: nonNegativeIndex.optional()
});

export const addBlocksSchema = z.object({
  blocks: z
    .array(addBlockEntrySchema)
    .min(1, "blocks must contain at least one entry")
});

export const addBlankBlockSchema = z.object({
  blockType: blockTypeEnum.optional(),
  insertIndex: nonNegativeIndex.optional(),
  paddingTop: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional(),
  bgColorHex: hexColorRequired.optional(),
  bgColorOpacity: z.number().min(0).max(1).optional()
});

export const removeBlockSchema = z
  .object({
    blockId: z.string().min(1).optional(),
    blockIndex: nonNegativeIndex.optional()
  })
  .refine((d) => d.blockId !== undefined || d.blockIndex !== undefined, {
    message: "Provide either blockId or blockIndex"
  });

export const moveBlockSchema = z.object({
  blockId: z.string().min(1).optional(),
  fromIndex: nonNegativeIndex.optional(),
  toIndex: nonNegativeIndex
});

export const duplicateBlockSchema = z
  .object({
    blockId: z.string().min(1).optional(),
    blockIndex: nonNegativeIndex.optional(),
    insertAfter: z.boolean().optional()
  })
  .refine((d) => d.blockId !== undefined || d.blockIndex !== undefined, {
    message: "Provide either blockId or blockIndex"
  });

// ===========================================
// ELEMENT TOOLS - Generic
// ===========================================

export const removeElementSchema = z.object({
  elementId: z.string().min(1, "elementId is required")
});

export const duplicateElementSchema = z.object({
  elementId: z.string().min(1, "elementId is required"),
  insertAfter: z.boolean().optional()
});

export const moveElementSchema = z.object({
  elementId: z.string().min(1, "elementId is required"),
  targetContainerId: z.string().min(1, "targetContainerId is required"),
  targetIndex: nonNegativeIndex.optional()
});

// ===========================================
// PROJECT TOOLS - Styles & Fonts
// ===========================================

export const changeStyleSchema = z.object({
  styleId: z.string().min(1, "styleId is required")
});

export const duplicateStyleSchema = z.object({
  title: z.string().min(1).optional()
});

export const addFontSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("google"),
    family: z.string().min(1, "family is required for google fonts"),
    setAsDefault: z.boolean().optional()
  }),
  z.object({
    type: z.literal("adobe"),
    adobeKitId: z.string().min(1, "adobeKitId is required for adobe fonts"),
    setAsDefault: z.boolean().optional()
  })
]);

export const deleteFontSchema = z.object({
  brizyId: z.string().min(1, "brizyId is required"),
  type: z.enum(["google", "upload", "adobe"])
});

export const changeDefaultFontSchema = z.object({
  font: z.string().min(1, "font is required")
});
