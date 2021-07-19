import { Id, Type } from "visual/config/icons/Type";
import { Icon } from "visual/config/icons/Icon";
import { Category } from "visual/config/icons/Categories";
import { categories as ncCats } from "visual/config/icons/categories/nc";
import { categories as faCats } from "visual/config/icons/categories/fa";
import { types as freeTypes } from "visual/config/icons/types/free";
import { types as proTypes } from "visual/config/icons/types/pro";
import { IS_WP, IS_PRO } from "visual/utils/env";
import * as Arr from "visual/utils/array";
import { getTypeIcons } from "visual/config/icons/icons";

export const getTypes = (): Type[] =>
  IS_WP ? (IS_PRO ? [...proTypes, ...freeTypes] : freeTypes) : proTypes;

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
