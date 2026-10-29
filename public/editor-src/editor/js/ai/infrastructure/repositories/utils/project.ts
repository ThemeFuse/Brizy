import {
  fontFamilyTypeEnum,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  paletteColorSchema
} from "@brizy/ai-tools";
import { produce } from "immer";
import { z } from "zod";
import type { Fonts } from "visual/types/Fonts";
import type { FontStyle, Palette, Style } from "visual/types/Style";
import type { FontKeyTypes } from "visual/utils/fonts/getFontById";
import { fontTransform, tripId } from "visual/utils/fonts/transform";
import { uuid } from "visual/utils/uuid";
import type {
  FontStyleSummary,
  FontSummary,
  StyleDetail,
  StyleSummary
} from "../../../application/interfaces/i-project-repository";

// ===========================================
// Zod schemas for project tool validation
// ===========================================

// The family is the one value every device shares, so it sits with desktop.
const desktopFontStyleFields = {
  fontFamily: z.string().min(1).optional(),
  fontFamilyType: fontFamilyTypeEnum.optional(),
  fontSize: fontSize.optional(),
  fontWeight: fontWeight.optional(),
  lineHeight: lineHeight.optional(),
  letterSpacing: letterSpacing.optional()
};

// Stored per device and never derived from the desktop value, so each is its
// own key: zod strips what it does not declare, and a stripped key is a change
// the tool reports as applied and nothing renders.
const tabletFontStyleFields = {
  tabletFontSize: fontSize.optional(),
  tabletFontWeight: fontWeight.optional(),
  tabletLineHeight: lineHeight.optional(),
  tabletLetterSpacing: letterSpacing.optional()
};

const mobileFontStyleFields = {
  mobileFontSize: fontSize.optional(),
  mobileFontWeight: fontWeight.optional(),
  mobileLineHeight: lineHeight.optional(),
  mobileLetterSpacing: letterSpacing.optional()
};

export const updateStyleSchema = z
  .object({
    colorPalette: z
      .array(paletteColorSchema)
      .length(8, "Color palette must contain exactly 8 colors")
      .optional(),
    fontStyles: z
      .array(
        z.object({
          id: z.string().min(1),
          ...desktopFontStyleFields,
          ...tabletFontStyleFields,
          ...mobileFontStyleFields
        })
      )
      .min(1)
      .optional()
  })
  .refine((data) => data.colorPalette || data.fontStyles, {
    message:
      "Provide at least colorPalette or fontStyles to update. Use getProjectStyles to see the current values."
  });

export type UpdateStyleInput = z.infer<typeof updateStyleSchema>;

/**
 * The palette tool takes the slots that change, where updateStyleSchema takes
 * all eight. Strict, so that font styles sent here are refused rather than
 * dropped from a call that then reports success.
 */
export const updateColorPaletteSchema = z
  .object({
    colorPalette: z.array(paletteColorSchema).min(1).max(8)
  })
  .strict();

export type UpdateColorPaletteInput = z.infer<typeof updateColorPaletteSchema>;

/**
 * The three font style tools take the same slots under one device's keys each.
 * Strict, where updateStyleSchema is not: a key that belongs to another device
 * is a call sent to the wrong tool, and stripping it would report a change
 * that never happened. `wrongDevice` tells the agent where the key goes.
 */
const fontStyleUpdatesSchema = <T extends z.ZodRawShape>(
  fields: T,
  wrongDevice: string
) =>
  z
    .object({
      fontStyles: z
        .array(
          z.object({ id: z.string().min(1), ...fields }).strict(wrongDevice)
        )
        .min(1)
    })
    .strict();

export const updateFontStyleSchema = fontStyleUpdatesSchema(
  desktopFontStyleFields,
  "updateFontStyle sets the font family and the desktop size, weight, line height and letter spacing. Send tablet* keys to updateFontStyleTablet and mobile* keys to updateFontStyleMobile."
);

export const updateFontStyleTabletSchema = fontStyleUpdatesSchema(
  tabletFontStyleFields,
  "updateFontStyleTablet takes only tabletFontSize, tabletFontWeight, tabletLineHeight and tabletLetterSpacing. Send the font family and desktop values to updateFontStyle, and mobile* keys to updateFontStyleMobile."
);

export const updateFontStyleMobileSchema = fontStyleUpdatesSchema(
  mobileFontStyleFields,
  "updateFontStyleMobile takes only mobileFontSize, mobileFontWeight, mobileLineHeight and mobileLetterSpacing. Send the font family and desktop values to updateFontStyle, and tablet* keys to updateFontStyleTablet."
);

/**
 * Which requested font-style ids do not exist on the target style?
 *
 * mergeStyleUpdate `continue`s past an unmatched id, so callers reject the
 * whole request up front rather than applying it partially.
 */
export function unknownFontStyleIds(
  style: Style,
  fontStyles: { id?: unknown }[] | undefined
): string[] {
  if (!fontStyles) return [];

  const known = new Set(style.fontStyles.map((fs) => fs.id));

  return fontStyles.map((fs) => String(fs.id)).filter((id) => !known.has(id));
}

export const knownFontStyleIds = (style: Style): string[] =>
  style.fontStyles.map((fs) => fs.id);

export function mergeStyleUpdate(
  currentStyle: Style,
  params: UpdateStyleInput
): Style {
  return produce(currentStyle, (draft) => {
    if (params.colorPalette) {
      draft.colorPalette = params.colorPalette;
    }

    if (params.fontStyles) {
      for (const update of params.fontStyles) {
        const existing = draft.fontStyles.find((fs) => fs.id === update.id);
        if (!existing) continue;

        Object.assign(existing, update);
        if (update.fontFamily) {
          existing.fontFamily = tripId(update.fontFamily);
        }
      }
    }
  });
}

export const knownPaletteSlots = (style: Style): string[] =>
  style.colorPalette.map((color) => color.id);

/**
 * Which requested palette slots does the target style not have?
 *
 * mergePaletteUpdate `continue`s past one, like mergeStyleUpdate does, so the
 * caller rejects the request rather than report a colour that was not set.
 */
export const unknownPaletteSlots = (
  style: Style,
  slots: Palette[]
): string[] => {
  const known = new Set(knownPaletteSlots(style));

  return slots.map((slot) => slot.id).filter((id) => !known.has(id));
};

export function mergePaletteUpdate(
  currentStyle: Style,
  slots: Palette[]
): Style {
  return produce(currentStyle, (draft) => {
    for (const slot of slots) {
      const existing = draft.colorPalette.find((color) => color.id === slot.id);
      if (!existing) continue;

      existing.hex = slot.hex;
    }
  });
}

export const toStyleSummary = (s: Style): StyleSummary => ({
  id: s.id,
  title: s.title
});

export const toFontStyleSummary = (fs: FontStyle): FontStyleSummary => ({
  id: fs.id,
  title: fs.title,
  fontFamily: fs.fontFamily,
  fontFamilyType: fs.fontFamilyType,
  fontSize: fs.fontSize,
  fontWeight: fs.fontWeight,
  lineHeight: fs.lineHeight,
  letterSpacing: fs.letterSpacing,
  tabletFontSize: fs.tabletFontSize,
  tabletFontWeight: fs.tabletFontWeight,
  tabletLineHeight: fs.tabletLineHeight,
  tabletLetterSpacing: fs.tabletLetterSpacing,
  mobileFontSize: fs.mobileFontSize,
  mobileFontWeight: fs.mobileFontWeight,
  mobileLineHeight: fs.mobileLineHeight,
  mobileLetterSpacing: fs.mobileLetterSpacing
});

export const toStyleDetail = (style: Style): StyleDetail => ({
  id: style.id,
  title: style.title,
  colorPalette: style.colorPalette,
  fontStyles: style.fontStyles.map(toFontStyleSummary)
});

export function toFontSummaries(fonts: Fonts): FontSummary[] {
  const summaries: FontSummary[] = [];

  for (const [group, { data }] of Object.entries(fonts)) {
    const transform = fontTransform[group as FontKeyTypes];

    for (const font of data) {
      const details = transform(font);
      summaries.push({
        brizyId: details.brizyId ?? details.id,
        family: details.title,
        type: group as FontSummary["type"],
        category:
          "category" in font ? (font as { category: string }).category : ""
      });
    }
  }

  return summaries;
}

export function duplicateCurrentStyle(
  currentStyle: Style,
  title?: string
): Style {
  return produce(currentStyle, (draft) => {
    draft.id = uuid();
    draft.title = title ?? `${currentStyle.title} (Copy)`;
  });
}
