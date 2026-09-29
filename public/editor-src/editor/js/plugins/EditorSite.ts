/**
 * The site half of the plugin API: menus and global blocks. Spread onto
 * `EditorAPI`, which is one flat level — this module only keeps the bodies out
 * of `EditorAPI.ts`.
 *
 * The site tools live in `@brizy/ai-chat` and decide; this side commits.
 */
import type {
  GlobalBlockSummary,
  IGlobalBlockRepository,
  SiteBlockPosition
} from "visual/ai/application/interfaces/i-global-block-repository";
import type {
  ConfigCommon,
  MenuData,
  MenuItem
} from "visual/global/Config/types/configs/ConfigCommon";
import type {
  ActionAddMenuData,
  ActionRemoveMenuData,
  ActionUpdateMenuData
} from "visual/redux/actions2";
import {
  addMenuData,
  removeMenuData,
  updateMenuData
} from "visual/redux/actions2";
import { menuDataSelector } from "visual/redux/selectors";
import type { ReduxState } from "visual/redux/types";

/** One entry of a menu, as the chat package hands it over. */
export interface EditorMenuItem {
  uid: string;
  title: string;
  slug: string;
  /** IRI of the linked page (`/collection_items/<n>`), for its `editorUrl`. */
  pageId: string;
  isCurrent: boolean;
}

export interface EditorSiteAPI {
  getMenus(): ReadonlyArray<{ id: string; name: string }>;
  addMenu(uid: string, name: string, items: EditorMenuItem[]): void;
  addMenuItems(menuUid: string, items: EditorMenuItem[]): void;
  removeMenuItems(menuUid: string, itemUids: string[]): void;
  removeMenu(menuId: string): void;
  globalBlocksSupported(): boolean;
  listGlobalBlocks(): GlobalBlockSummary[];
  createGlobalBlock(
    blockData: Record<string, unknown>,
    position: SiteBlockPosition,
    positionIndex: number
  ): Promise<{ uid: string }>;
  deleteGlobalBlock(uid: string): Promise<void>;
}

/** The config this module reads — only what `editorUrl` is built from. */
export type SiteConfig = Pick<ConfigCommon, "project" | "pro">;

/** Everything this module dispatches: plain menu actions, never a thunk. */
export type MenuAction =
  | ActionAddMenuData
  | ActionUpdateMenuData
  | ActionRemoveMenuData;

/**
 * Reads the store through `menuDataSelector`, so a menu slice that moves stays
 * a selector change; `EditorAPI` hands over the whole `getState` and the config
 * `editorUrl` is built from.
 */
export function createEditorSite(
  getState: () => ReduxState,
  dispatch: (action: MenuAction) => void,
  globalBlocks: IGlobalBlockRepository,
  config: SiteConfig
): EditorSiteAPI {
  const toMenuItem = menuItemBuilder(config);

  return {
    getMenus(): ReadonlyArray<{ id: string; name: string }> {
      return menuDataSelector(getState());
    },

    /**
     * Append a created menu to the `menuData` store slice so Menu components
     * re-render and show it live, without a reload.
     */
    addMenu(uid: string, name: string, items: EditorMenuItem[]): void {
      const entry: MenuData = { id: uid, name, items: items.map(toMenuItem) };

      dispatch(addMenuData(entry));
    },

    /**
     * Append entries to a menu the CMS has already grown — a page was created
     * and linked into the navigation.
     *
     * Appends to the entries already held rather than rebuilding them, for the
     * same reason `removeMenuItems` filters: every existing entry keeps its
     * url, target and classes, which `ai-chat` never sees.
     */
    addMenuItems(menuUid: string, items: EditorMenuItem[]): void {
      const menu = menuDataSelector(getState()).find((m) => m.id === menuUid);

      if (!menu || items.length === 0) {
        return;
      }

      dispatch(
        updateMenuData(menuUid, [...menu.items, ...items.map(toMenuItem)])
      );
    },

    /**
     * Drop items from a menu the CMS has already pruned — the page they linked
     * to is gone.
     *
     * Filters the entries the editor already holds instead of rebuilding them,
     * so every survivor keeps its url, target and classes; `ai-chat` knows
     * which items went, not what the rest look like.
     */
    removeMenuItems(menuUid: string, itemUids: string[]): void {
      const menu = menuDataSelector(getState()).find((m) => m.id === menuUid);

      if (!menu || itemUids.length === 0) {
        return;
      }

      const removed = new Set(itemUids);
      const items = rejectItems(menu.items, removed);

      // A menu whose items are untouched must not repaint the editor.
      if (items === menu.items) {
        return;
      }

      dispatch(updateMenuData(menuUid, items));
    },

    removeMenu(menuId: string): void {
      dispatch(removeMenuData(menuId));
    },

    globalBlocksSupported(): boolean {
      return globalBlocks.isSupported();
    },

    listGlobalBlocks(): GlobalBlockSummary[] {
      return globalBlocks.list();
    },

    createGlobalBlock(
      blockData: Record<string, unknown>,
      position: SiteBlockPosition,
      positionIndex: number
    ): Promise<{ uid: string }> {
      return globalBlocks.create(blockData, position, positionIndex);
    },

    deleteGlobalBlock(uid: string): Promise<void> {
      return globalBlocks.delete(uid);
    }
  };
}

/** The numeric tail of a collection-item IRI (`/collection_items/12` -> `12`). */
const pageIdOf = (iri: string): string | undefined =>
  /(?:^|\/)(\d+)$/.exec(iri)?.[1];

/**
 * Where the parent window is sent when the item's "edit page" toolbar button is
 * used. Root-relative: the editor is served from the same origin, and no config
 * value carries the absolute base.
 *
 * The dev server routes `/editor/:mode/:id` with no project segment and reads
 * pro off the query (`backend/server.js`), so development builds a different
 * shape from the deployed `/projects/<id>/editor/page/<id>`.
 *
 * Empty when the page id cannot be read — the toolbar button disables itself on
 * an empty `editorUrl`, which beats navigating somewhere wrong.
 */
function editorUrlOf(config: SiteConfig, pageId: string): string {
  const id = pageIdOf(pageId);

  if (id === undefined) {
    return "";
  }

  if (process.env.NODE_ENV === "development") {
    return `/editor/page/${id}${config.pro ? "?pro=true" : ""}`;
  }

  return `/projects/${config.project.id}/editor/page/${id}`;
}

/** Builds one `menuData` entry from the chat package's hand-over. */
const menuItemBuilder =
  (config: SiteConfig) =>
  (item: EditorMenuItem): MenuItem => ({
    type: "MenuItem",
    value: {
      // Minted by the backend. This is the key the editor stores per-item
      // customisations under (`symbolsToItems` in Menu/utils.ts), so it has to
      // be the same value a reloaded config would carry — otherwise any styling
      // done on the item this session is orphaned after a refresh.
      id: item.uid,
      title: item.title,
      url: `/${item.slug}`,
      target: "",
      items: [],
      megaMenuItems: [],
      attrTitle: "",
      classes: [],
      liClasses: [],
      // Menu components paint the active item off this flag.
      current: item.isCurrent,
      editorUrl: editorUrlOf(config, item.pageId)
    }
  });

/**
 * The item list without the removed uids, sub-items included. Returns the very
 * same array when nothing matched, so callers can skip a no-op dispatch.
 */
function rejectItems(items: MenuItem[], removed: Set<string>): MenuItem[] {
  let changed = false;

  const kept = items.reduce<MenuItem[]>((acc, item) => {
    if (removed.has(item.value.id)) {
      changed = true;
      return acc;
    }

    const children = rejectItems(item.value.items, removed);

    if (children === item.value.items) {
      acc.push(item);
    } else {
      changed = true;
      acc.push({ ...item, value: { ...item.value, items: children } });
    }

    return acc;
  }, []);

  return changed ? kept : items;
}
