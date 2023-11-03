import { Category } from "visual/config/icons/Categories";
import { Icon } from "visual/config/icons/Icon";
import { Id, Type } from "visual/config/icons/Type";
import { categories as faCats } from "visual/config/icons/categories/fa";
import { categories as ncCats } from "visual/config/icons/categories/nc";
import { getTypeIcons } from "visual/config/icons/icons";
import { types as freeTypes } from "visual/config/icons/types/free";
import { types as proTypes } from "visual/config/icons/types/pro";
import * as Arr from "visual/utils/array";
import { IS_PRO, IS_WP } from "visual/utils/env";

const allTypes = [...proTypes, ...freeTypes];
export const getTypes = (): Type[] =>
  IS_WP ? (IS_PRO ? allTypes : freeTypes) : allTypes;

export const getIcons = (types: Id[]): Promise<Icon[]> => {
  return Promise.all(types.map(getTypeIcons)).then(Arr.concat);
};

export const getIconClassName = (icon: Icon): string => {
  switch (icon.type) {
    case 0:
    case 1: {
      const typeName = getTypes()[icon.type].name;
      return `nc-${typeName} nc-${typeName}-${icon.name}`;
    }
    case 2:
      return `${icon.family ?? "fa"} fa-${icon.name}`;
  }
};

export const getCategories = (type: Id): Category[] => {
  switch (type) {
    case 0:
    case 1:
      return ncCats;
    case 2:
      return faCats;
  }
};
