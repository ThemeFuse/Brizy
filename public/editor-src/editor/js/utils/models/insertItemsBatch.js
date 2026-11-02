import { insert } from "timm";
import { setIds } from "visual/utils/models/index";
import { stripSystemKeys } from "visual/utils/models/stripSystemKeys";

export const insertItemsBatch = (items, itemIndex, itemsData) => {
  const updatedValue = itemsData.reduce((acc, itemData, index) => {
    const itemDataStripped = stripSystemKeys(itemData);
    const itemDataWithIds = setIds(itemDataStripped);

    return insert(acc, itemIndex + index, itemDataWithIds);
  }, items);

  return updatedValue;
};
