import { Icon, read } from "visual/config/icons/Icon";
import { Id } from "visual/config/icons/Type";
import { toArray } from "visual/utils/array";

const readIcons = (m: { default: unknown[] }): Icon[] => {
  return toArray(m?.default)
    .map(read)
    .filter(Boolean) as Icon[];
};

export const getTypeIcons = (type: Id): Promise<Icon[]> => {
  switch (type) {
    case 0:
      return import("./iconTypes/outline.json").then(readIcons);
    case 1:
      return import("./iconTypes/glyph.json").then(readIcons);
    case 2:
      return import("./iconTypes/fa.json").then(readIcons);
  }
};
