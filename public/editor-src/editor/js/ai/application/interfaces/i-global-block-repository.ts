/**
 * Where a global block is anchored on the page: `top` = header, `bottom` = footer.
 */
export type SiteBlockPosition = "top" | "bottom";

/** A global block, flattened to what the chat package decides on. */
export interface GlobalBlockSummary {
  uid: string;
  /** `null` for an entry with no position (a popup, typically). */
  align: SiteBlockPosition | null;
  /** Popups live in the same map but are not managed by the site tools. */
  isPopup: boolean;
  /** Soft-deleted earlier this session; gone as far as the project cares. */
  deleted: boolean;
}

/**
 * The Redux and REST half of global blocks.
 *
 * These are primitives, not tools: the `createGlobalBlock` /
 * `deleteGlobalBlock` / `deleteAllGlobalBlocks` tools live in `@brizy/ai-chat`
 * and call in through the editor port. This side owns what only it can do —
 * the `GlobalBlockNormal` shape, the `config.api.globalBlocks` handlers, and
 * the store dispatches — and makes no decisions of its own.
 */
export interface IGlobalBlockRepository {
  /** Whether this platform can persist global blocks at all. */
  isSupported(): boolean;

  /** Every global block the project holds, popups and soft-deleted included. */
  list(): GlobalBlockSummary[];

  /**
   * Build, persist and insert one global block, at `positionIndex` among the
   * blocks sharing its align. Throws when the server did not store it.
   */
  create(
    blockData: Record<string, unknown>,
    position: SiteBlockPosition,
    positionIndex: number
  ): Promise<{ uid: string }>;

  /** Delete one global block, from the backend and the current session. */
  delete(uid: string): Promise<void>;
}
