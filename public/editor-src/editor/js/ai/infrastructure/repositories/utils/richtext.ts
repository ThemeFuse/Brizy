import {
  blockValues,
  formatVToQuilValue
} from "visual/editorComponents/RichText/utils/transforms";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { FontStyle } from "visual/types/Style";
import { hexToRgb } from "visual/utils/color";
import {
  type FontStyleTypes,
  is as isFontStyle
} from "visual/utils/fonts/stylesType";
import { getComponentDefaultValue } from "visual/utils/traverse/common";
import type { MValue } from "visual/utils/value";

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
const FONT_FAMILY_TYPE_PREFIX =
  blockValues.class.typographyFontFamilyType.prefix; // brz-ft
const FONT_SIZE_PREFIX = blockValues.class.typographyFontSize.prefix; // brz-fs-lg
const FONT_WEIGHT_PREFIX = blockValues.class.typographyFontWeight.prefix; // brz-fw-lg
const LINE_HEIGHT_PREFIX = blockValues.class.typographyLineHeight.prefix; // brz-lh-lg
const LETTER_SPACING_PREFIX = blockValues.class.typographyLetterSpacing.prefix; // brz-ls-lg
const TEXT_ALIGN_PREFIX = blockValues.class.contentHorizontalAlign.prefix; // brz-text-lg

// Default typography values from blockValues (used when clearing presets)
const DEFAULT_FONT_SIZE = blockValues.class.typographyFontSize
  .defaultValue as number; // 16
const DEFAULT_FONT_WEIGHT = blockValues.class.typographyFontWeight
  .defaultValue as number; // 400
const DEFAULT_LINE_HEIGHT = blockValues.class.typographyLineHeight
  .defaultValue as number; // 1.3

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
 * Inline wrapper tags that can carry color/formatting in RichText HTML.
 * Both spans and links (<a href>) may hold the text color.
 */
const INLINE_WRAPPER_TAGS = new Set(["SPAN", "A"]);

/**
 * Return the first inline wrapper (span/a) whose color/formatting should be
 * preserved when the block's content is composed entirely of inline wrappers
 * (optionally separated by whitespace-only text nodes), e.g. multiple colored
 * spans or a colored link:
 *   <h1><span class="brz-cp-color8">A </span><span class="brz-cp-color3">B</span></h1>
 *   <p><a href="#" class="brz-cp-color3">Link</a></p>
 *
 * In that case there is no raw text mixed with the wrappers, so when replacing
 * the whole text we can keep the first wrapper (with its color) instead of
 * dropping all formatting. Returns null when the block has raw (non-whitespace)
 * text mixed in, or when it contains no inline wrappers at all.
 */
function getPreservableWrapper(block: Element): Element | null {
  let firstWrapper: Element | null = null;

  for (const child of Array.from(block.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (!INLINE_WRAPPER_TAGS.has(child.nodeName)) return null;
      if (!firstWrapper) firstWrapper = child as Element;
    } else if (child.nodeType === Node.TEXT_NODE) {
      // Raw text mixed with wrappers -> not a pure-wrapper block
      if ((child.textContent || "").trim() !== "") return null;
    }
  }

  return firstWrapper;
}

/**
 * Replace the text inside an inline wrapper while preserving nested inline
 * wrappers (e.g. <a href="#"><span class="brz-cp-color3">text</span></a>).
 * Descends the first inline-wrapper chain and sets the text on the innermost
 * wrapper, removing any sibling nodes at each level so a single formatted
 * chain remains.
 */
function setWrapperText(wrapper: Element, newText: string): void {
  const innerWrapper = getPreservableWrapper(wrapper);

  if (innerWrapper) {
    setWrapperText(innerWrapper, newText);
    // Drop siblings of the preserved inner wrapper
    for (const child of Array.from(wrapper.childNodes)) {
      if (child !== innerWrapper) {
        wrapper.removeChild(child);
      }
    }
  } else {
    wrapper.textContent = newText;
  }
}

/**
 * Check if element already has a class with the given prefix
 */
function hasClassWithPrefix(element: Element, prefix: string): boolean {
  return element.className.split(" ").some((c) => c.startsWith(`${prefix}-`));
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

function collectTextNodes(doc: Document): Text[] {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

  const textNodes: Text[] = [];
  let node: Text | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: TreeWalker iteration idiom - the alternative duplicates the nextNode() call on both the seed and the advance
  while ((node = walker.nextNode() as Text | null)) {
    textNodes.push(node);
  }

  return textNodes;
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

  // Replace text in each text node
  for (const textNode of collectTextNodes(doc)) {
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
        const preservableWrapper = getPreservableWrapper(block);
        if (preservableWrapper) {
          // Content is entirely inline wrappers (colored spans and/or links):
          // keep the first wrapper (with its color) and drop the rest so the
          // color is preserved instead of lost.
          setWrapperText(preservableWrapper, newText);
          for (const child of Array.from(block.childNodes)) {
            if (child !== preservableWrapper) {
              block.removeChild(child);
            }
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
 * The preset an element currently uses, read before clearTypographyPresets
 * replaces it with "empty". Both spellings are cleared, so both are read:
 * brz-tp-lg-heading1 (responsive) and brz-tp-paragraph (legacy).
 */
function readTypographyPresetId(element: Element): MValue<string> {
  const responsivePrefix = `${TYPOGRAPHY_FONT_STYLE_PREFIX}-`;
  const classes = element.className.split(" ").filter(Boolean);

  for (const cls of classes) {
    if (
      cls.startsWith(responsivePrefix) &&
      cls !== `${responsivePrefix}empty`
    ) {
      return cls.slice(responsivePrefix.length);
    }
  }

  for (const cls of classes) {
    if (isLegacyTypographyPreset(cls)) {
      return cls.slice(LEGACY_TYPOGRAPHY_PREFIX.length);
    }
  }

  return undefined;
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
function applyFontStyle(element: Element, fontStyle: FontStyleTypes): void {
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
  },
  // Project typography presets, used to carry a cleared preset's values over.
  fontStyles: FontStyle[]
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
    // Read the preset before it is cleared, so its values can be carried over.
    const clearedPresetId = readTypographyPresetId(block);

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
    }

    // Detaching drops the preset's size, weight, line-height and letter
    // spacing, so carry them over as explicit classes — what the editor's
    // typography option does via Patch.fullFont. Any custom value detaches,
    // not just fontFamily; the constants are a fallback for an unresolvable
    // preset.
    const detachedFromPreset =
      clearedPresetId !== undefined &&
      (fontStyle === "" || (fontStyle === undefined && hasCustomValues));

    if (detachedFromPreset) {
      const preset = fontStyles.find((fs) => fs.id === clearedPresetId);

      const carryOver = [
        {
          explicit: fontSize,
          prefix: FONT_SIZE_PREFIX,
          value: preset?.fontSize ?? DEFAULT_FONT_SIZE
        },
        {
          explicit: fontWeight,
          prefix: FONT_WEIGHT_PREFIX,
          value: preset?.fontWeight ?? DEFAULT_FONT_WEIGHT
        },
        {
          explicit: lineHeight,
          prefix: LINE_HEIGHT_PREFIX,
          value: preset?.lineHeight ?? DEFAULT_LINE_HEIGHT
        },
        {
          explicit: undefined,
          prefix: LETTER_SPACING_PREFIX,
          value: preset?.letterSpacing
        }
      ];

      for (const { explicit, prefix, value } of carryOver) {
        if (
          explicit === undefined &&
          value !== undefined &&
          !hasClassWithPrefix(block, prefix)
        ) {
          updateClassWithPrefix(block, prefix, value);
        }
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

function prepareRichTextHtml(currentHtml: string): string {
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
  return normalizeRichTextHtml(html);
}

/**
 * Whether a findText replacement would change anything: findAndReplaceInHtml
 * matches case-sensitively inside one text node of the prepared HTML.
 */
export function containsFindText(
  currentHtml: string,
  findText: string
): boolean {
  const parser = new DOMParser();
  const html = prepareRichTextHtml(currentHtml);
  const doc = parser.parseFromString(html, "text/html");

  return collectTextNodes(doc).some((textNode) =>
    (textNode.textContent ?? "").includes(findText)
  );
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
  params: UpdateRichTextParams,
  fontStyles: FontStyle[]
): string {
  let html = prepareRichTextHtml(currentHtml);

  // An empty findText is treated as absent: it would compile to an empty regex
  // that matches at every position.
  if (params.findText && params.replaceWith !== undefined) {
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
  html = applyTypographyStyles(
    html,
    {
      fontStyle: params.fontStyle,
      fontSize: params.fontSize,
      fontWeight: params.fontWeight,
      lineHeight: params.lineHeight,
      textAlign: params.textAlign,
      fontFamily: params.fontFamily,
      fontFamilyType: params.fontFamilyType
    },
    fontStyles
  );

  return html;
}
