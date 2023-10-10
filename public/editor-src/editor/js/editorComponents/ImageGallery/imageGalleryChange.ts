import produce from "immer";
import { mergeIn } from "timm";
import { setIds } from "visual/utils/models";
import type { Value } from "./index";

export const patchOnColumnChange = (
  columns: number,
  newV: Value,
  oldV: Value
): Value => {
  const { layout } = newV;
  const { items: oldItems } = oldV;

  const itemsLength = oldItems.length;
  const _itemsLength = layout === "bigImage" ? itemsLength - 1 : itemsLength;

  if (_itemsLength < columns) {
    const lastImageValue = oldItems[_itemsLength - 1].value;

    if (lastImageValue) {
      const _lastImageValue = produce(
        lastImageValue,
        (draftState: Partial<Value>) => {
          if (draftState.imageSrc) {
            delete draftState.imageSrc;
          }

          if (draftState.imageFileName) {
            delete draftState.imageFileName;
          }
        }
      );

      const newItems = [
        ...oldItems,
        setIds({ type: "Image", value: _lastImageValue })
      ];

      return mergeIn(newV, ["items"], newItems) as Value;
    }
  }

  return newV;
};
