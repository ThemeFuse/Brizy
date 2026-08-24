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
import { removeMenuData } from "visual/ai/infrastructure/repositories/utils";
import type {
  ConfigCommon,
  MenuData,
  MenuItem
} from "visual/global/Config/types/configs/ConfigCommon";

/** One entry of a menu, as the chat package hands it over. */
export interface EditorMenuItem {
  uid: string;
  title: string;
  slug: string;
  isCurrent: boolean;
}

export interface EditorSiteAPI {
  getMenus(): ReadonlyArray<{ id: string; name: string }>;
  addMenu(uid: string, name: string, items: EditorMenuItem[]): void;
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

export function createEditorSite(
  config: ConfigCommon,
  globalBlocks: IGlobalBlockRepository
): EditorSiteAPI {
  return {
    getMenus(): ReadonlyArray<{ id: string; name: string }> {
      return config.menuData ?? [];
    },

    /**
     * Append a created menu to `config.menuData` IN PLACE so Menu components
     * re-read it and render live without a reload.
     *
     * Relies on the config object here being the SAME reference
     * `ConfigProvider` readers close over — the mutation is otherwise
     * invisible.
     */
    addMenu(uid: string, name: string, items: EditorMenuItem[]): void {
      const entry: MenuData = {
        id: uid,
        name,
        items: items.map(
          (item): MenuItem => ({
            type: "MenuItem",
            value: {
              // Minted by the backend. This is the key the editor stores
              // per-item customisations under (`symbolsToItems` in
              // Menu/utils.ts), so it has to be the same value a reloaded
              // config would carry — otherwise any styling done on the item
              // this session is orphaned after a refresh.
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
              editorUrl: `/${item.slug}`
            }
          })
        )
      };

      if (config.menuData) {
        config.menuData.push(entry);
      } else {
        config.menuData = [entry];
      }
    },

    removeMenu(menuId: string): void {
      removeMenuData(config, menuId);
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
