import { produce } from "immer";
import { z } from "zod";
import type { Fonts } from "visual/types/Fonts";
import type { FontStyle, Palette, Style } from "visual/types/Style";
import { type FontKeyTypes } from "visual/utils/fonts/getFontById";
import { fontTransform, tripId } from "visual/utils/fonts/transform";
import { uuid } from "visual/utils/uuid";
import {
  fontFamilyTypeEnum,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  paletteColorSchema
} from "../../../adapters/schema-primitives";
import type {
  FontStyleSummary,
  FontSummary,
  StyleDetail,
  StyleSummary
} from "../../../application/interfaces/i-project-repository";

// ===========================================
// Zod schemas for project tool validation
// ===========================================

const fontStyleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  fontFamily: z.string().min(1),
  fontFamilyType: fontFamilyTypeEnum.optional(),
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing
});

export const addStyleSchema = z
  .object({
    title: z.string().min(1, "Style title is required"),
    colorPalette: z
      .array(paletteColorSchema)
      .length(8, "Color palette must contain exactly 8 colors")
      .optional(),
    fontStyles: z.array(fontStyleSchema).min(1).optional()
  })
  .refine((data) => data.colorPalette || data.fontStyles, {
    message:
      "Provide at least a colorPalette or fontStyles. Use getProjectStyles to see the current style as reference."
  });

export type AddStyleInput = z.infer<typeof addStyleSchema>;

const updateFontStyleSchema = z.object({
  id: z.string().min(1),
  fontFamily: z.string().min(1).optional(),
  fontFamilyType: fontFamilyTypeEnum.optional(),
  fontSize: fontSize.optional(),
  fontWeight: fontWeight.optional(),
  lineHeight: lineHeight.optional(),
  letterSpacing: letterSpacing.optional()
});

export const updateStyleSchema = z
  .object({
    colorPalette: z
      .array(paletteColorSchema)
      .length(8, "Color palette must contain exactly 8 colors")
      .optional(),
    fontStyles: z.array(updateFontStyleSchema).min(1).optional()
  })
  .refine((data) => data.colorPalette || data.fontStyles, {
    message:
      "Provide at least colorPalette or fontStyles to update. Use getProjectStyles to see the current values."
  });

export type UpdateStyleInput = z.infer<typeof updateStyleSchema>;

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
  letterSpacing: fs.letterSpacing
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

export function buildNewStyle(params: {
  title: string;
  colorPalette?: Palette[];
  fontStyles?: Record<string, unknown>[];
  currentStyle: Style;
}): Style {
  const { title, currentStyle } = params;

  return produce(currentStyle, (draft) => {
    draft.id = uuid();
    draft.title = title;

    if (params.colorPalette) {
      draft.colorPalette = params.colorPalette;
    }

    if (params.fontStyles) {
      for (const fs of params.fontStyles) {
        const existing = draft.fontStyles.find(
          (cfs) => cfs.id === (fs.id as string)
        );
        if (!existing) continue;

        Object.assign(existing, fs, { deletable: "off" });
        if (typeof fs.fontFamily === "string") {
          existing.fontFamily = tripId(fs.fontFamily);
        }
      }
    }
  });
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
