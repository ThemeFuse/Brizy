import {
  blockValues,
  formatVToQuilValue
} from "visual/editorComponents/RichText/utils/transforms";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { hexToRgb } from "visual/utils/color";
import {
  FontStyleTypes,
  is as isFontStyle
} from "visual/utils/fonts/stylesType";
import { getComponentDefaultValue } from "visual/utils/traverse/common";

/**
 * Predefined font style types available in Brizy
 * These map to brz-tp-lg-{style} classes
 */
export type { FontStyleTypes };

/**
 * Parameters for updating RichText element
 * LLM sends plain text, not HTML
 */
export interface UpdateRichTextParams {
  /** Plain text to find and replace */
  findText?: string;
  /** Plain text replacement */
  replaceWith?: string;
  /** Text color in hex format */
  colorHex?: string;
  /** Text color opacity */
  colorOpacity?: number;
  /**
   * Predefined font style (paragraph, heading1-6)
   * When set, applies the predefined typography preset
   * Custom values (fontSize, fontWeight, etc.) will override the preset if also provided
   */
  fontStyle?: FontStyleTypes | "";
  /** Font size in pixels (overrides fontStyle if both provided) */
  fontSize?: number;
  /** Font weight (100-900) (overrides fontStyle if both provided) */
  fontWeight?: number;
  /** Line height multiplier (overrides fontStyle if both provided) */
  lineHeight?: number;
  /** Text alignment */
  textAlign?: "left" | "center" | "right" | "justify";
  /** Font family in builder format (e.g. "open_sans") — stored as brz-ff-{value} class in HTML */
  fontFamily?: string;
  /** Font source type */
  fontFamilyType?: string;
}

export { isFontStyle };

// Extract prefixes from RichText blockValues for consistency
const TYPOGRAPHY_FONT_STYLE_PREFIX =
  blockValues.class.typographyFontStyle.prefix; // brz-tp-lg
const TABLET_FONT_STYLE_PREFIX =
  blockValues.class.tabletTypographyFontStyle.prefix; // brz-tp-sm
const MOBILE_FONT_STYLE_PREFIX =
  blockValues.class.mobileTypographyFontStyle.prefix; // brz-tp-xs
const FONT_FAMILY_PREFIX = blockValues.class.typographyFontFamily.prefix; // brz-ff
const FONT_FAMILY_TYPE_PREFIX = blockValues.class.typographyFontFamilyType.prefix; // brz-ft
const FONT_SIZE_PREFIX = blockValues.class.typographyFontSize.prefix; // brz-fs-lg
const FONT_WEIGHT_PREFIX = blockValues.class.typographyFontWeight.prefix; // brz-fw-lg
const LINE_HEIGHT_PREFIX = blockValues.class.typographyLineHeight.prefix; // brz-lh-lg
const TEXT_ALIGN_PREFIX = blockValues.class.contentHorizontalAlign.prefix; // brz-text-lg

// Default typography values from blockValues (used when clearing presets)
const DEFAULT_FONT_SIZE = blockValues.class.typographyFontSize.defaultValue as number; // 16
const DEFAULT_FONT_WEIGHT = blockValues.class.typographyFontWeight.defaultValue as number; // 400
const DEFAULT_LINE_HEIGHT = blockValues.class.typographyLineHeight.defaultValue as number; // 1.3

/**
 * Check if block has simple structure (only one span child, no direct text)
 */
function hasSimpleSpanStructure(block: Element): boolean {
  const children = block.childNodes;
  if (children.length !== 1) return false;

  const child = children[0];
  return child.nodeType === Node.ELEMENT_NODE && child.nodeName === "SPAN";
}

/**
 * Check if element already has a class with the given prefix
 */
function hasClassWithPrefix(element: Element, prefix: string): boolean {
  return element.className
    .split(" ")
    .some((c) => c.startsWith(`${prefix}-`));
}

/**
 * Update or add a class with a specific prefix
 * Removes any existing class with the same prefix, then adds the new one
 */
function updateClassWithPrefix(
  element: Element,
  prefix: string,
  value: string | number
): void {
  const currentClasses = element.className.split(" ").filter(Boolean);

  // Remove existing classes with this prefix
  const filteredClasses = currentClasses.filter(
    (c) => !c.startsWith(`${prefix}-`)
  );

  // Add new class using RichText's formatVToQuilValue for consistent formatting
  const formattedValue = formatVToQuilValue(value);
  filteredClasses.push(`${prefix}-${formattedValue}`);

  element.className = filteredClasses.join(" ");
}

// Note: HTML validation is handled by Zod schema in element-schemas.ts (plainText refinement)

/**
 * Update RichText HTML with color changes
 * Uses DOMParser to:
 * 1. Remove all existing spans
 * 2. Wrap text content in a single span with the new color
 * Supports p, h1-h6 elements
 */
export function updateRichTextColor(
  html: string,
  colorHex: string,
  colorOpacity = 1
): string {
  const rgb = hexToRgb(colorHex);
  if (!rgb) return html;

  // Create the color style - always use rgb/rgba for consistency
  const colorStyle =
    colorOpacity < 1 ? `rgba(${rgb}, ${colorOpacity})` : `rgb(${rgb})`;

  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Process all text block elements (p, h1-h6)
  const textBlocks = doc.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6");

  textBlocks.forEach((block) => {
    if (hasSimpleSpanStructure(block)) {
      // Simple structure: just update color on existing span
      const span = block.querySelector("span");
      if (span) {
        span.style.color = colorStyle;
        // Remove color class if exists (using inline style instead)
        span.className = span.className
          .split(" ")
          .filter((c) => !c.startsWith("brz-cp-"))
          .join(" ");
      }
    } else {
      // Mixed content: get text, clear, create new colored span
      const textContent = block.textContent || "";
      block.innerHTML = "";

      const span = doc.createElement("span");
      span.style.color = colorStyle;
      span.textContent = textContent;
      block.appendChild(span);
    }
  });

  // Serialize back to HTML (just the inner content, not full document)
  return doc.body.innerHTML;
}

/**
 * Find and replace text in HTML content
 * Replaces text content while preserving HTML structure
 */
export function findAndReplaceInHtml(
  html: string,
  findText: string,
  replaceWith: string
): string {
  // Escape special regex characters in the search text
  const escapedFind = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapedFind, "g");

  // Parse HTML to work with text content
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Walk through all text nodes and replace
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

  const textNodes: Text[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    textNodes.push(node);
  }

  // Replace text in each text node
  for (const textNode of textNodes) {
    textNode.textContent = (textNode.textContent || "").replace(
      regex,
      replaceWith
    );
  }

  return doc.body.innerHTML;
}

/**
 * Replace ALL text content in HTML while preserving structure
 * - Simple structure (p > span): preserve span, replace text inside
 * - Mixed content (text + spans): put plain text in block (no span unless color applied later)
 * - No block elements: create default <p class="brz-tp-paragraph">text</p>
 */
export function replaceAllTextInHtml(html: string, newText: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Process all text block elements (p, h1-h6)
  const textBlocks = doc.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6");

  if (textBlocks.length === 0) {
    // No block elements - create default RichText structure
    const p = doc.createElement("p");
    p.className = "brz-tp-paragraph";
    p.textContent = newText;
    doc.body.innerHTML = "";
    doc.body.appendChild(p);
  } else {
    // Put all text in first block, clear others
    textBlocks.forEach((block, index) => {
      if (index === 0) {
        if (hasSimpleSpanStructure(block)) {
          // Simple structure: preserve span, replace text inside
          const span = block.querySelector("span");
          if (span) {
            span.textContent = newText;
          }
        } else {
          // Mixed content: put plain text in block (span added by updateRichTextColor if needed)
          block.textContent = newText;
        }
      } else {
        // Remove additional blocks
        block.remove();
      }
    });
  }

  return doc.body.innerHTML;
}

/**
 * Typography preset class prefixes that override custom styles
 * When applying custom typography, these need to be replaced with "empty"
 * Uses prefixes from RichText blockValues for consistency
 */
const TYPOGRAPHY_PRESET_PREFIXES = [
  `${TYPOGRAPHY_FONT_STYLE_PREFIX}-`, // brz-tp-lg-
  `${TABLET_FONT_STYLE_PREFIX}-`, // brz-tp-sm-
  `${MOBILE_FONT_STYLE_PREFIX}-` // brz-tp-xs-
];

// Legacy prefix (brz-tp-) handled separately to avoid matching responsive prefixes
const LEGACY_TYPOGRAPHY_PREFIX = "brz-tp-";

/**
 * Check if a class is a legacy typography preset (brz-tp-{style} but not brz-tp-lg-/sm-/xs-)
 */
function isLegacyTypographyPreset(cls: string): boolean {
  if (!cls.startsWith(LEGACY_TYPOGRAPHY_PREFIX)) return false;
  // Exclude responsive prefixes (they start with brz-tp-lg-, brz-tp-sm-, brz-tp-xs-)
  for (const prefix of TYPOGRAPHY_PRESET_PREFIXES) {
    if (cls.startsWith(prefix)) return false;
  }
  // Exclude the empty class
  if (cls === `${LEGACY_TYPOGRAPHY_PREFIX}empty`) return false;
  return true;
}

/**
 * Replace typography preset classes with "empty" to allow custom styles
 * Preset classes like brz-tp-lg-paragraph override custom font-size/weight/etc
 */
function clearTypographyPresets(element: Element): void {
  const currentClasses = element.className.split(" ").filter(Boolean);
  const updatedClasses: string[] = [];
  const addedEmpty = new Set<string>();

  for (const cls of currentClasses) {
    let isPreset = false;

    // Check responsive prefixes first
    for (const prefix of TYPOGRAPHY_PRESET_PREFIXES) {
      if (cls.startsWith(prefix) && cls !== `${prefix}empty`) {
        isPreset = true;
        // Add the "empty" version if not already added
        const emptyClass = `${prefix}empty`;
        if (!addedEmpty.has(emptyClass)) {
          updatedClasses.push(emptyClass);
          addedEmpty.add(emptyClass);
        }
        break;
      }
    }

    // Check legacy prefix
    if (!isPreset && isLegacyTypographyPreset(cls)) {
      isPreset = true;
      const emptyClass = "brz-tp-empty";
      if (!addedEmpty.has(emptyClass)) {
        updatedClasses.push(emptyClass);
        addedEmpty.add(emptyClass);
      }
    }

    if (!isPreset) {
      updatedClasses.push(cls);
    }
  }

  element.className = updatedClasses.join(" ");
}

/**
 * Apply a predefined font style to an element
 * Sets the brz-tp-lg-{style} class
 */
function applyFontStyle(
  element: Element,
  fontStyle: FontStyleTypes
): void {
  updateClassWithPrefix(element, TYPOGRAPHY_FONT_STYLE_PREFIX, fontStyle);
}

/**
 * Apply typography styles to HTML content via Brizy class names
 * Uses Brizy's className system:
 * - brz-tp-lg-{style} for fontStyle preset (paragraph, heading1-6)
 * - brz-fs-lg-{value} for fontSize
 * - brz-fw-lg-{value} for fontWeight
 * - brz-lh-lg-{value} for lineHeight (decimals as underscores)
 * - brz-text-lg-{value} for textAlign
 *
 * When fontStyle is provided, applies the preset.
 * When custom values (fontSize, etc.) are provided without fontStyle,
 * clears presets and applies custom values.
 * When both are provided, applies fontStyle then custom values override.
 */
export function applyTypographyStyles(
  html: string,
  params: {
    fontStyle?: FontStyleTypes | "";
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    textAlign?: "left" | "center" | "right" | "justify";
    fontFamily?: string;
    fontFamilyType?: string;
  }
): string {
  const {
    fontStyle,
    fontSize,
    fontWeight,
    lineHeight,
    textAlign,
    fontFamily,
    fontFamilyType
  } = params;

  // Check if any typography params are provided
  if (
    fontStyle === undefined &&
    fontSize === undefined &&
    fontWeight === undefined &&
    lineHeight === undefined &&
    textAlign === undefined &&
    fontFamily === undefined
  ) {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Process all text block elements (p, h1-h6)
  const textBlocks = doc.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6");

  const hasCustomValues =
    fontSize !== undefined ||
    fontWeight !== undefined ||
    lineHeight !== undefined ||
    fontFamily !== undefined;

  textBlocks.forEach((block) => {
    if (fontStyle !== undefined) {
      // Clear existing presets first
      clearTypographyPresets(block);
      // Apply predefined font style (skip if empty - just clearing presets)
      if (fontStyle !== "") {
        applyFontStyle(block, fontStyle);
      }
    } else if (hasCustomValues) {
      // No fontStyle but custom values (including fontFamily) - clear presets to allow custom styles
      clearTypographyPresets(block);
    }

    // Apply fontFamily/fontFamilyType classes
    if (fontFamily !== undefined) {
      updateClassWithPrefix(block, FONT_FAMILY_PREFIX, fontFamily);
      updateClassWithPrefix(
        block,
        FONT_FAMILY_TYPE_PREFIX,
        fontFamilyType ?? "google"
      );

      // When clearing preset for fontFamily, ensure individual typography
      // classes exist so text doesn't lose sizing. Add defaults only if
      // no explicit value was provided AND no existing class is present.
      if (fontSize === undefined && !hasClassWithPrefix(block, FONT_SIZE_PREFIX)) {
        updateClassWithPrefix(block, FONT_SIZE_PREFIX, DEFAULT_FONT_SIZE);
      }
      if (fontWeight === undefined && !hasClassWithPrefix(block, FONT_WEIGHT_PREFIX)) {
        updateClassWithPrefix(block, FONT_WEIGHT_PREFIX, DEFAULT_FONT_WEIGHT);
      }
      if (lineHeight === undefined && !hasClassWithPrefix(block, LINE_HEIGHT_PREFIX)) {
        updateClassWithPrefix(block, LINE_HEIGHT_PREFIX, DEFAULT_LINE_HEIGHT);
      }
    }

    // Apply custom values (these override fontStyle if both provided)
    if (fontSize !== undefined) {
      updateClassWithPrefix(block, FONT_SIZE_PREFIX, fontSize);
    }
    if (fontWeight !== undefined) {
      updateClassWithPrefix(block, FONT_WEIGHT_PREFIX, fontWeight);
    }
    if (lineHeight !== undefined) {
      // formatVToQuilValue handles decimal conversion (1.5 -> "1_5")
      updateClassWithPrefix(block, LINE_HEIGHT_PREFIX, lineHeight);
    }
    if (textAlign !== undefined) {
      updateClassWithPrefix(block, TEXT_ALIGN_PREFIX, textAlign);
    }
  });

  return doc.body.innerHTML;
}

/**
 * Ensure HTML has proper block-level elements.
 * If the HTML is plain text without any p/h1-h6 wrapper,
 * wraps it in a default <p class="brz-tp-paragraph"> element.
 */
function normalizeRichTextHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const textBlocks = doc.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6");

  if (textBlocks.length === 0 && doc.body.textContent) {
    const p = doc.createElement("p");
    p.className = "brz-tp-paragraph";
    p.textContent = doc.body.textContent;
    doc.body.innerHTML = "";
    doc.body.appendChild(p);
    return doc.body.innerHTML;
  }

  return html;
}

/**
 * Apply RichText updates to the HTML value
 * Returns the updated HTML string
 *
 * LLM sends plain text, this function handles HTML internally:
 * - findText + replaceWith: find and replace specific text
 * - replaceWith only: replace ALL text content
 */
export function applyRichTextUpdates(
  currentHtml: string,
  params: UpdateRichTextParams
): string {
  let html = currentHtml;

  // get from defaultComponent
  if (!html) {
    const content = getComponentDefaultValue(ElementTypes.RichText)?.content;
    if (content?.text && typeof content.text === "string") {
      html = content.text || "";
    }
  }

  // Ensure HTML has proper block-level elements (p, h1-h6)
  // Handles cases where the value is plain text without HTML wrapper
  html = normalizeRichTextHtml(html);

  // Find and replace specific text
  if (params.findText !== undefined && params.replaceWith !== undefined) {
    html = findAndReplaceInHtml(html, params.findText, params.replaceWith);
  } else if (params.replaceWith !== undefined) {
    // Replace ALL text when only replaceWith is provided
    html = replaceAllTextInHtml(html, params.replaceWith);
  }

  // Update color if provided (applies to all text)
  if (params.colorHex !== undefined) {
    html = updateRichTextColor(html, params.colorHex, params.colorOpacity ?? 1);
  }

  // Apply typography styles if provided
  html = applyTypographyStyles(html, {
    fontStyle: params.fontStyle,
    fontSize: params.fontSize,
    fontWeight: params.fontWeight,
    lineHeight: params.lineHeight,
    textAlign: params.textAlign,
    fontFamily: params.fontFamily,
    fontFamilyType: params.fontFamilyType
  });

  return html;
}
