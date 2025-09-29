import { uniqBy } from "es-toolkit";
import type { ElementModel } from "visual/component/Elements/Types";
import type { Block } from "visual/types/Block";
import type { GlobalBlock } from "visual/types/GlobalBlock";
import { objectTraverse2 } from "visual/utils/object";

export function getModelPopups(
  model: ElementModel,
  allGlobalBlocks: Record<string, GlobalBlock>
): Array<Block> {
  const popups: Array<Block> = [];

  objectTraverse2(model, (obj: Record<string, unknown>) => {
    const popupList = obj.linkPopupPopups ?? obj.popups;

    if (Array.isArray(popupList)) {
      popups.push(...popupList);
    }
  });

  const uniquePopups = uniqBy(popups, (p) => p.value._id);

  return uniquePopups.filter((p) => allGlobalBlocks[p.value._id]);
}
