import type {
  AddBlockResult,
  AddElementResult,
  BrizyToolResult,
  DuplicateElementResult,
  ElementDetails,
  GetAvailableIconsResult,
  MoveElementResult,
  PageStructure,
  RemoveBlockResult,
  RemoveElementResult,
  SearchElementsResult,
  UpdateElementResult
} from "../../entities/models";

/**
 * Add block params
 */
export interface AddBlockParams {
  readonly blockType: string;
  readonly insertIndex?: number;
  readonly background?: {
    readonly bgColorHex?: string;
    readonly bgColorOpacity?: number;
    readonly bgImageSrc?: string;
  };
  readonly paddingTop?: number;
  readonly paddingBottom?: number;
  /** Raw block data from backend API (e.g., from generateBlock). When provided, used instead of creating a default empty block. */
  readonly blockData?: unknown;
}

/**
 * Insert template params
 */
export interface InsertTemplateParams {
  readonly templateId: string;
  readonly insertIndex?: number;
}

/**
 * Add element params
 */
export interface AddElementParams {
  readonly containerId: string;
  readonly elementType: string;
  readonly insertIndex?: number;
  readonly initialProperties?: Record<string, unknown>;
}

/**
 * Search elements params
 */
export interface SearchElementsParams {
  /** Exact element type to match (e.g., 'Button', 'RichText') */
  readonly type?: string;
  /** Regex pattern to match element type */
  readonly typeRegex?: string;
  /** Simple text search using fuzzy matching (case-insensitive) */
  readonly containsText?: string;
  /** Regex pattern to match text content */
  readonly textRegex?: string;
  /** Search only within a specific block */
  readonly blockId?: string;
  /** Maximum results to return (default: 20) */
  readonly limit?: number;
}

/**
 * Remove element params
 */
export interface RemoveElementParams {
  readonly elementId: string;
}

/**
 * Update element params - validated changes from Zod schemas
 */
export interface UpdateElementParams {
  readonly elementId: string;
  readonly elementType: string;
  readonly changes: Record<string, unknown>;
}

/**
 * Move element params
 */
export interface MoveElementParams {
  readonly elementId: string;
  readonly targetContainerId: string;
  readonly targetIndex?: number;
}

/**
 * Duplicate element params - validated changes from Zod schemas
 */
export interface DuplicateElementParams {
  readonly elementId: string;
  readonly insertAfter?: boolean;
}

/**
 * Update RichText element params
 * RichText uses QuillJS and stores content as HTML
 *
 * LLM sends plain text, not HTML:
 * - Use `findText` + `replaceWith` to replace specific text
 * - Use style properties to apply formatting
 */
export interface UpdateRichTextParams {
  readonly elementId: string;
  /** Plain text to find and replace */
  readonly findText?: string;
  /** Plain text replacement */
  readonly replaceWith?: string;
  /** Text color in hex format (e.g., '#FF0000') */
  readonly colorHex?: string;
  /** Text color opacity (0-1) */
  readonly colorOpacity?: number;
  /**
   * Predefined font style preset (paragraph, subtitle, abovetitle, heading1-6, button)
   * When set, applies the predefined typography preset
   */
  readonly fontStyle?:
    | ""
    | "paragraph"
    | "subtitle"
    | "abovetitle"
    | "heading1"
    | "heading2"
    | "heading3"
    | "heading4"
    | "heading5"
    | "heading6"
    | "button";
  /** Font size in pixels (overrides fontStyle if both provided) */
  readonly fontSize?: number;
  /** Font weight (100-900) (overrides fontStyle if both provided) */
  readonly fontWeight?: number;
  /** Line height multiplier (overrides fontStyle if both provided) */
  readonly lineHeight?: number;
  /** Text alignment */
  readonly textAlign?: "left" | "center" | "right" | "justify";
  /** Font family in builder format (e.g. "open_sans") — stored on element value */
  readonly fontFamily?: string;
  /** Font source type */
  readonly fontFamilyType?: string;
}

/**
 * Get available icons params
 */
export interface GetAvailableIconsParams {
  readonly iconType?: "outline" | "glyph" | "fa";
  readonly search?: string;
  readonly limit?: number;
}

/**
 * Interface for page repository
 * Abstracts Redux state access for page data
 */
export interface IPageRepository {
  /**
   * Get page structure
   */
  getPageStructure(depth?: number): PageStructure;

  /**
   * Add a block
   */
  addBlock(params: AddBlockParams): BrizyToolResult<AddBlockResult>;

  /**
   * Remove a block
   */
  removeBlock(params: {
    blockId?: string;
    blockIndex?: number;
  }): BrizyToolResult<RemoveBlockResult>;

  /**
   * Move a block
   */
  moveBlock(params: {
    blockId?: string;
    fromIndex?: number;
    toIndex: number;
  }): BrizyToolResult<{
    blockId: string;
    previousIndex: number;
    newIndex: number;
  }>;

  /**
   * Duplicate a block
   */
  duplicateBlock(params: {
    blockId?: string;
    blockIndex?: number;
    insertAfter?: boolean;
  }): BrizyToolResult<{
    originalBlockId: string;
    newBlockId: string;
    insertedAt: number;
  }>;

  /**
   * Clear all blocks from the page
   */
  clearPage(): BrizyToolResult<{ removedCount: number }>;

  /**
   * Insert a template
   */
  insertTemplate(params: InsertTemplateParams): BrizyToolResult<{
    blockId: string;
    insertedAt: number;
  }>;

  /**
   * Get an element by its ID
   */
  getElementById(elementId: string): BrizyToolResult<ElementDetails>;

  /**
   * Search for elements matching criteria
   */
  searchElements(
    params: SearchElementsParams
  ): BrizyToolResult<SearchElementsResult>;

  /**
   * Add an element to a container
   */
  addElement(params: AddElementParams): BrizyToolResult<AddElementResult>;

  /**
   * Remove an element from the page
   */
  removeElement(
    params: RemoveElementParams
  ): BrizyToolResult<RemoveElementResult>;

  /**
   * Update an element's properties
   */
  updateElement(
    params: UpdateElementParams
  ): BrizyToolResult<UpdateElementResult>;

  /**
   * Update a column element, redistributing sibling column widths when width changes
   */
  updateColumn(
    params: UpdateElementParams
  ): BrizyToolResult<UpdateElementResult>;

  /**
   * Duplicate an element's properties
   */
  duplicateElement(
    params: DuplicateElementParams
  ): BrizyToolResult<DuplicateElementResult>;

  /**
   * Move an element to a different container or position
   */
  moveElement(params: MoveElementParams): BrizyToolResult<MoveElementResult>;

  /**
   * Update a RichText element's content and/or color
   * RichText uses QuillJS and requires special handling
   */
  updateRichText(
    params: UpdateRichTextParams
  ): BrizyToolResult<UpdateElementResult>;

  /**
   * Get available icons
   */
  getAvailableIcons(
    params: GetAvailableIconsParams
  ): Promise<BrizyToolResult<GetAvailableIconsResult>>;

  /**
   * Check if the current user has Brizy Pro
   */
  isPro(): boolean;
}
