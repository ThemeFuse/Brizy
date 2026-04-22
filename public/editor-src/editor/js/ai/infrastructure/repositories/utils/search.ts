import FuzzySearch from "fuzzy-search";
import type { Block } from "visual/types/Block";
import { getComponentDefaultValue } from "visual/utils/traverse/common";
import type { SearchElementsParams } from "../../../application/interfaces/i-page-repository";
import type { SearchResultItem } from "../../../entities/models";

/**
 * Internal search result with text for fuzzy filtering
 */
export interface InternalSearchResult extends SearchResultItem {
  searchText: string;
}

/**
 * Safely create a RegExp from a string pattern
 * Returns null if the pattern is invalid
 */
/**
 * Max allowed regex pattern length to prevent ReDoS from complex patterns
 */
const MAX_REGEX_LENGTH = 200;

function safeRegex(pattern: string, flags = "i"): RegExp | null {
  if (pattern.length > MAX_REGEX_LENGTH) return null;
  try {
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}

/**
 * Check if element type matches the search criteria
 */
function matchesTypeFilter(
  elementType: string,
  params: SearchElementsParams
): boolean {
  // Exact type match
  if (params.type && elementType !== params.type) {
    return false;
  }

  // Regex type match
  if (params.typeRegex) {
    const regex = safeRegex(params.typeRegex);
    if (regex && !regex.test(elementType)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if element text matches regex criteria (not fuzzy search)
 */
function matchesTextRegex(
  text: string | undefined,
  params: SearchElementsParams
): boolean {
  // Regex text match only - fuzzy search is handled separately
  if (params.textRegex) {
    const textStr = typeof text === "string" ? text : "";
    const regex = safeRegex(params.textRegex);
    if (regex && !regex.test(textStr)) {
      return false;
    }
  }

  return true;
}

/**
 * Extract all searchable text from an element's value
 * Combines all string properties into a single searchable string
 */
function extractSearchableText(element: Block): string {
  const textParts: string[] = [];
  const content = getComponentDefaultValue(element.type)?.content;
  const value = { ...content, ...element.value };

  // Collect all string values from the element (except internal keys)
  for (const [key, val] of Object.entries(value)) {
    // Skip internal keys only
    if (key.startsWith("_") || key === "items") continue;

    if (typeof val === "string" && val.trim()) {
      // Strip HTML tags for cleaner search
      const cleanText = val.replace(/<[^>]*>/g, " ").trim();
      if (cleanText) {
        textParts.push(cleanText);
      }
    }
  }

  return textParts.join(" ");
}

/**
 * Collects elements recursively within an element
 * Applies type and regex filters, but NOT fuzzy text search
 */
export function collectElements(
  element: Block,
  path: string[],
  params: SearchElementsParams,
  results: InternalSearchResult[],
  parentId?: string
): void {
  // Extract all searchable text from element
  const searchText = extractSearchableText(element);

  // Get primary text for display (prefer text/content fields)
  const displayText =
    element.value?.text || element.value?.content || searchText;
  const displayTextStr = typeof displayText === "string" ? displayText : "";

  // Check type filter (exact or regex)
  const matchesType = matchesTypeFilter(element.type, params);

  // Check text regex filter (not fuzzy - that's applied later)
  const matchesRegex = matchesTextRegex(searchText, params);

  if (matchesType && matchesRegex) {
    results.push({
      id: element.value?._id || "",
      type: element.type,
      path,
      text: displayTextStr || undefined,
      parentId,
      searchText // All searchable text for fuzzy matching
    });
  }

  // Recursively search children
  const items = element.value?.items;
  if (Array.isArray(items)) {
    items.forEach((item: Block, index: number) => {
      if (item && typeof item === "object") {
        collectElements(
          item,
          [...path, "value", "items", String(index)],
          params,
          results,
          element.value?._id
        );
      }
    });
  }
}

/**
 * Apply fuzzy search to collected results
 */
export function applyFuzzySearch(
  results: InternalSearchResult[],
  searchText: string
): InternalSearchResult[] {
  if (!searchText) {
    return results;
  }

  const searcher = new FuzzySearch(results, ["searchText", "type"], {
    caseSensitive: false
  });

  return searcher.search(searchText);
}

/**
 * Convert internal results to public results (remove searchText field)
 */
export function toSearchResults(
  items: InternalSearchResult[],
  limit: number
): SearchResultItem[] {
  const results: SearchResultItem[] = [];

  for (const item of items) {
    if (results.length >= limit) break;

    // Remove internal searchText field
    const { searchText: _, ...result } = item;
    results.push(result);
  }

  return results;
}

/**
 * Searches for elements recursively within an element
 * @deprecated Use collectElements + applyFuzzySearch + toSearchResults for proper fuzzy search across blocks
 */
export function searchInElement(
  element: Block,
  path: string[],
  params: SearchElementsParams,
  results: SearchResultItem[],
  limit: number,
  parentId?: string
): void {
  // Collect all matching elements (type + regex filters)
  const candidates: InternalSearchResult[] = [];
  collectElements(element, path, params, candidates, parentId);

  // Apply fuzzy search if containsText is provided
  const filtered = params.containsText
    ? applyFuzzySearch(candidates, params.containsText)
    : candidates;

  // Add to results up to limit
  const converted = toSearchResults(filtered, limit - results.length);
  results.push(...converted);
}
