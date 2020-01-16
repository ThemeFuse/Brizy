import { stripSystemKeys } from "visual/utils/models/stripSystemKeys";
import { setIds } from "visual/utils/models/index";
import { insert } from "timm";

export const insertItem = (items, itemIndex, itemData) => {
  const itemDataStripped = stripSystemKeys(itemData);
  const itemDataWithIds = setIds(itemDataStripped);
  const updatedValue = insert(items, itemIndex, itemDataWithIds);

  return updatedValue;
};
