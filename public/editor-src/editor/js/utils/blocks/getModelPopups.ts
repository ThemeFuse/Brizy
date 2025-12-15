import { uniqBy } from "es-toolkit";
import type { ElementModel } from "visual/component/Elements/Types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import type { Block } from "visual/types/Block";
import type { GlobalBlock } from "visual/types/GlobalBlock";
import { modelTraverse } from "../traverse";

export function getModelPopups(
  model: ElementModel,
  allGlobalBlocks: Record<string, GlobalBlock>
): Array<Block> {
  const popups: Array<Block> = [];
  const popupType: string[] = [
    ElementTypes.SectionPopup,
    ElementTypes.SectionPopup2
  ];

  const conditions = {
    [ElementTypes.GlobalBlock]: (obj: Block) => {
      const block = allGlobalBlocks[obj.value._id];

      if (block && popupType.includes(block.data.type)) {
        popups.push(obj);
      }
    }
  };

  modelTraverse(model, conditions);

  return uniqBy(popups, (p) => p.value._id);
}
