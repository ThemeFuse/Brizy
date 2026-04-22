// ===========================================
// Tool types (local copies — editor owns these)
// ===========================================

/**
 * JSON Schema type for tool parameters
 */
export interface ToolParameterSchema {
  readonly type: "object";
  readonly properties: Record<string, unknown>;
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean;
}

/**
 * Tool definition — describes a tool the LLM can call
 */
export interface ToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly parameters: ToolParameterSchema;
  readonly category?: string;
  readonly strict?: boolean;
}

/**
 * Tool execution response
 */
export interface ToolExecutionResponse {
  readonly requestId: string;
  readonly success: boolean;
  readonly data?: unknown;
  readonly error?: string;
  readonly duration: number;
  readonly undoable?: boolean;
}

/**
 * Tool handler function
 */
export type ToolHandler = (
  args: Record<string, unknown>
) => Promise<unknown> | unknown;

// ===========================================
// Page / element types
// ===========================================

/**
 * Element summary for page structure
 */
export interface ElementSummary {
  readonly id: string;
  readonly type: string;
  readonly label?: string;
  readonly children?: readonly ElementSummary[];
}

/**
 * Block summary for page structure
 */
export interface BlockSummary {
  readonly id: string;
  readonly type: string;
  readonly children: readonly ElementSummary[];
}

/**
 * Page structure representation
 */
export interface PageStructure {
  readonly blocksOrder: readonly string[];
  readonly blocks: readonly BlockSummary[];
}

/**
 * Tool execution result with undo support
 */
export interface BrizyToolResult<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly undoAction?: {
    readonly type: string;
    readonly payload: unknown;
  };
}

/**
 * Add block result
 */
export interface AddBlockResult {
  readonly blockId: string;
  readonly insertedAt: number;
}

/**
 * Remove block result
 */
export interface RemoveBlockResult {
  readonly removedBlockId: string;
  readonly removedAt: number;
}

/**
 * Element details for getElementById
 */
export interface ElementDetails {
  readonly id: string;
  readonly type: string;
  readonly path: readonly string[];
  readonly value: Record<string, unknown>;
  readonly parentId?: string;
  readonly parentType?: string;
}

/**
 * Search result item
 */
export interface SearchResultItem {
  readonly id: string;
  readonly type: string;
  readonly path: readonly string[];
  readonly text?: string;
  readonly parentId?: string;
}

/**
 * Search elements result
 */
export interface SearchElementsResult {
  readonly elements: readonly SearchResultItem[];
  readonly totalFound: number;
  /** Number of blocks that were searched */
  readonly searchedBlocks?: number;
}

/**
 * Add element result
 */
export interface AddElementResult {
  readonly elementId: string;
  readonly containerId: string;
  readonly insertedAt: number;
  readonly childElementId: string | undefined;
}

/**
 * Remove element result
 */
export interface RemoveElementResult {
  readonly elementId: string;
  readonly containerId: string;
  readonly removedAt: number;
}

/**
 * Duplicate element result
 */
export interface DuplicateElementResult {
  readonly elementId: string;
  readonly containerId: string;
  readonly duplicatedAt: number;
}

/**
 * Move element result
 */
export interface MoveElementResult {
  readonly elementId: string;
  readonly fromContainerId: string;
  readonly toContainerId: string;
  readonly movedTo: number;
}

/**
 * Update element result
 */
export interface UpdateElementResult {
  readonly elementId: string;
  readonly elementType: string;
  readonly previousValues?: Record<string, unknown>;
}

/**
 * Icon info for getAvailableIcons
 */
export interface IconInfo {
  readonly name: string;
  readonly title: string;
  readonly type: string;
}

/**
 * Get available icons result
 */
export interface GetAvailableIconsResult {
  readonly icons: readonly IconInfo[];
  readonly totalCount: number;
}
