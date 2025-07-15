import { uniqBy } from "es-toolkit";
import { ElementModel } from "visual/component/Elements/Types";
import { Block } from "visual/types/Block";
import { objectTraverse2 } from "visual/utils/object";

export function getModelPopups(model: ElementModel): Array<Block> {
  const popups: Array<Block> = [];

  objectTraverse2(model, (obj: Record<string, unknown>) => {
    const popupList = obj.linkPopupPopups ?? obj.popups;

    if (Array.isArray(popupList)) {
      popups.push(...popupList);
    }
  });

  return uniqBy(popups, (p) => p.value._id);
}
