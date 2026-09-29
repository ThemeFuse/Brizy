import type { GlobalBlockPosition } from "visual/types/GlobalBlock";

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
