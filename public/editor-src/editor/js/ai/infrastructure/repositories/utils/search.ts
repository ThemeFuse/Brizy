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
 * Max allowed regex pattern length to prevent ReDoS from complex patterns
 */
const MAX_REGEX_LENGTH = 200;

/**
 * Safely create a RegExp from a string pattern.
 * Returns undefined if the pattern is too long or does not compile.
 */
function safeRegex(pattern: string, flags = "i"): RegExp | undefined {
  if (pattern.length > MAX_REGEX_LENGTH) return undefined;
  try {
    return new RegExp(pattern, flags);
  } catch {
    return undefined;
  }
}

/**
 * The filters a search runs with, compiled once up front.
 */
export interface SearchFilters {
  type: string | undefined;
  typeRegex: RegExp | undefined;
  textRegex: RegExp | undefined;
}

export type CompileSearchFiltersResult =
  | { success: true; filters: SearchFilters }
  | { success: false; error: string };

/**
 * Compile the regex filters once, before walking the tree. An uncompilable
 * pattern is an error rather than a silently disabled filter, and `new RegExp`
 * stays out of the per-element path.
 */
export function compileSearchFilters(
  params: SearchElementsParams
): CompileSearchFiltersResult {
  const invalid = (name: string, pattern: string): string =>
    `Invalid ${name}: "${pattern}" is not a valid regular expression (max ${MAX_REGEX_LENGTH} characters).`;

  let typeRegex: RegExp | undefined;
  if (params.typeRegex) {
    typeRegex = safeRegex(params.typeRegex);
    if (!typeRegex) {
      return { success: false, error: invalid("typeRegex", params.typeRegex) };
    }
  }

  let textRegex: RegExp | undefined;
  if (params.textRegex) {
    textRegex = safeRegex(params.textRegex);
    if (!textRegex) {
      return { success: false, error: invalid("textRegex", params.textRegex) };
    }
  }

  return {
    success: true,
    filters: { type: params.type, typeRegex, textRegex }
  };
}

/**
 * Check if element type matches the search criteria
 */
function matchesTypeFilter(
  elementType: string,
  filters: SearchFilters
): boolean {
  // Exact type match
  if (filters.type && elementType !== filters.type) {
    return false;
  }

  // Regex type match
  if (filters.typeRegex && !filters.typeRegex.test(elementType)) {
    return false;
  }

  return true;
}

/**
 * Check if element text matches regex criteria (not fuzzy search)
 */
function matchesTextRegex(
  text: string | undefined,
  filters: SearchFilters
): boolean {
  // Regex text match only - fuzzy search is handled separately
  if (filters.textRegex) {
    return filters.textRegex.test(typeof text === "string" ? text : "");
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
  filters: SearchFilters,
  results: InternalSearchResult[],
  parentId?: string
): void {
  // Extract all searchable text from element
  const searchText = extractSearchableText(element);

  // Get primary text for display (prefer text/content/label fields).
  // `searchText` is a last resort: it merges the component's default content,
  // so for elements that store little (form fields) it is a long shared blob.
  const displayText =
    element.value?.text ||
    element.value?.content ||
    element.value?.label ||
    searchText;
  const displayTextStr = typeof displayText === "string" ? displayText : "";

  // Check type filter (exact or regex)
  const matchesType = matchesTypeFilter(element.type, filters);

  // Check text regex filter (not fuzzy - that's applied later)
  const matchesRegex = matchesTextRegex(searchText, filters);

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
          filters,
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
