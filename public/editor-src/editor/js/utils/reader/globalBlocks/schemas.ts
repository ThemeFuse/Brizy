import { Num, Str } from "@brizy/readers";
import { z } from "zod";
import type { ExtraFontStyle } from "visual/types/Style";

// Lenient on purpose, like the reader it replaces: a missing or unknown `type`
// falls back to "normal", and bad optional fields are dropped, not fatal.
// This meta is sent back to the API on save (stringifyGlobalBlock), so every
// field keeps the exact coercion the previous reader applied.
export const globalBlockMetaSchema = z.object({
  type: z.enum(["normal", "popup", "overlay"]).catch("normal"),
  // Only meaningful for "overlay".
  subtype: z.enum(["cookieBanner"]).optional().catch(undefined),
  // Items pass through unchecked, as they always have: dropping an item the
  // editor does not fully recognise would delete it from the stored block.
  extraFontStyles: z.array(z.custom<ExtraFontStyle>()).catch([]),
  // Str.read / Num.read, as before: numbers become strings and numeric
  // strings become numbers (API meta can carry either), anything else is
  // dropped.
  _thumbnailSrc: z.unknown().transform((v) => Str.read(v)),
  _thumbnailWidth: z.unknown().transform((v) => Num.read(v)),
  _thumbnailHeight: z.unknown().transform((v) => Num.read(v)),
  _thumbnailTime: z.unknown().transform((v) => Num.read(v))
});

export type GlobalBlockMetaInput = z.infer<typeof globalBlockMetaSchema>;
