import { uniq } from "underscore";
import { ElementModel } from "visual/component/Elements/Types";
import { objectTraverse2 } from "visual/utils/object";
import { Block } from "visual/types";

export function getModelPopups(model: ElementModel): Array<Block> {
  const popups: Array<Block> = [];
  objectTraverse2(model, (obj: Record<string, unknown>) => {
    if (Array.isArray(obj.popups)) {
      popups.push(...obj.popups);
    }
  });

  return uniq(popups, (p) => p.value._id);
}
