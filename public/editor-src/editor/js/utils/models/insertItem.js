import { insert } from "timm";
import { setIds } from "visual/utils/models/index";
import { stripSystemKeys } from "visual/utils/models/stripSystemKeys";

export const insertItem = (items, itemIndex, itemData) => {
  const itemDataStripped = stripSystemKeys(itemData);
  const itemDataWithIds = setIds(itemDataStripped);
  const updatedValue = insert(items, itemIndex, itemDataWithIds);

  return updatedValue;
};
