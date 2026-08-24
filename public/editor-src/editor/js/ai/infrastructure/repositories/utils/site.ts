import type { MenuData } from "visual/global/Config/types/configs/ConfigCommon";
import type { GlobalBlockPosition } from "visual/types/GlobalBlock";

/**
 * Drop a menu from `config.menuData` IN PLACE so Menu components stop rendering
 * it without a reload — the mirror of `EditorSite.addMenu`.
 *
 * Entries are keyed by the menu uid (`menuData[].id`), so a caller holding the
 * IRI has to call this with both ids.
 */
export function removeMenuData(
  config: { menuData?: MenuData[] },
  menuId: string
): boolean {
  const index = config.menuData?.findIndex((m) => m.id === menuId) ?? -1;

  if (index === -1) {
    return false;
  }

  config.menuData?.splice(index, 1);
  return true;
}

export function topInsertIndex(
  blocksOrder: ReadonlyArray<string>,
  globalBlocks: Record<string, { position?: GlobalBlockPosition | null }>
): number {
  let index = 0;
  while (index < blocksOrder.length) {
    const gb = globalBlocks[blocksOrder[index]];
    if (gb && gb.position?.align !== "bottom") {
      index += 1;
    } else {
      break;
    }
  }
  return index;
}
