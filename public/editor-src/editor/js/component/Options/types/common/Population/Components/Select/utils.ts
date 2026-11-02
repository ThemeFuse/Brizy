import type { Choice } from "visual/component/Options/types/dev/Select/types";
import type { CollectionItem } from "visual/utils/api/types";

export const convertToSelectChoices = (items: CollectionItem[]): Choice[] => [
  { title: "Auto", value: "" },
  ...items.map(({ id, title }) => ({
    title,
    value: id
  }))
];
