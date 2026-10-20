import type { Palette } from "visual/types/Style";
import type { BrizyToolResult } from "../../entities/models";
import type {
  UpdateColorPaletteInput,
  UpdateStyleInput
} from "../../infrastructure/repositories/utils";

/**
 * Lightweight style summary — just id + title for listing.
 */
export interface StyleSummary {
  readonly id: string;
  readonly title: string;
}

/**
 * Lightweight font style summary — the family plus the four measurements per
 * device, which is exactly what the font style tools can write. Strips the
 * transforms and the variable-font axes.
 */
export interface FontStyleSummary {
  readonly id: string;
  readonly title: string;
  readonly fontFamily: string;
  readonly fontFamilyType: string;
  readonly fontSize: number;
  readonly fontWeight: number;
  readonly lineHeight: number;
  readonly letterSpacing: number;
  readonly tabletFontSize: number;
  readonly tabletFontWeight: number;
  readonly tabletLineHeight: number;
  readonly tabletLetterSpacing: number;
  readonly mobileFontSize: number;
  readonly mobileFontWeight: number;
  readonly mobileLineHeight: number;
  readonly mobileLetterSpacing: number;
}

/**
 * Current style detail with palette and summarised font styles.
 */
export interface StyleDetail {
  readonly id: string;
  readonly title: string;
  readonly colorPalette: Palette[];
  readonly fontStyles: FontStyleSummary[];
}

/**
 * Lightweight font summary for LLM consumption.
 * Strips heavy fields (files, subsets, version, etc.)
 */
export interface FontSummary {
  readonly brizyId: string;
  readonly family: string;
  readonly type: "google" | "upload" | "adobe" | "system";
  readonly category: string;
}

/**
 * Google font search result summary.
 */
export interface GoogleFontSummary {
  readonly id: string;
  readonly title: string;
  readonly family: string;
  readonly category: string;
  readonly variants: string[];
  readonly weights: number[];
}

/**
 * Parameters for adding a font to the project.
 */
export type AddFontParams =
  | {
      readonly type: "google";
      readonly family: string;
      readonly setAsDefault?: boolean;
    }
  | {
      readonly type: "adobe";
      readonly adobeKitId: string;
      readonly setAsDefault?: boolean;
    };

/**
 * Interface for project repository
 * Abstracts Redux state access for project-level data (styles & fonts)
 */
export interface IProjectRepository {
  // === Styles ===

  /**
   * Get all styles and the current active style
   */
  getProjectStyles(): BrizyToolResult<{
    currentStyleId: string;
    currentStyle: StyleDetail;
    styles: StyleSummary[];
    extraStyles: StyleSummary[];
  }>;

  /**
   * Change the active style by ID
   */
  changeStyle(styleId: string): BrizyToolResult<{ styleId: string }>;

  /**
   * Update the current active style's color palette and/or font styles.
   * A palette sent here replaces all eight slots.
   */
  updateStyle(params: UpdateStyleInput): BrizyToolResult<{ styleId: string }>;

  /**
   * Change some of the current active style's palette slots, merged by id
   */
  updateColorPalette(
    params: UpdateColorPaletteInput
  ): BrizyToolResult<{ styleId: string }>;

  /**
   * Duplicate the current active style
   */
  duplicateStyle(title?: string): BrizyToolResult<{
    originalStyleId: string;
    newStyleId: string;
    title: string;
  }>;

  // === Fonts ===

  /**
   * Get all project fonts and the default font.
   * Returns lightweight summaries (family, brizyId, type, category).
   */
  getProjectFonts(): BrizyToolResult<{
    defaultFont: string;
    fonts: FontSummary[];
  }>;

  /**
   * Search the Google Fonts library
   */
  getGoogleFonts(params: {
    search: string;
    limit?: number;
  }): Promise<BrizyToolResult<{ fonts: GoogleFontSummary[] }>>;

  /**
   * Add a font to the project (google or adobe)
   */
  addFont(
    params: AddFontParams
  ): Promise<BrizyToolResult<{ family: string; type: string }>>;

  /**
   * Delete a font from the project
   */
  deleteFont(params: {
    brizyId: string;
    type: string;
  }): BrizyToolResult<{ brizyId: string }>;

  /**
   * Change the default font
   */
  changeDefaultFont(font: string): BrizyToolResult<{ font: string }>;

  /**
   * Check if a font family exists in the project fonts
   * Uses tripId normalization for matching
   */
  fontExists(fontFamily: string): boolean;
}
