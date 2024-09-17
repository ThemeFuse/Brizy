import { Category } from "visual/config/icons/Categories";
import { categories as faCats } from "visual/config/icons/categories/fa";
import { categories as ncCats } from "visual/config/icons/categories/nc";
import { Icon } from "visual/config/icons/Icon";
import { Type, TypeId } from "visual/config/icons/Type";
import { types as freeTypes } from "visual/config/icons/types/free";
import { types as proTypes } from "visual/config/icons/types/pro";
import Config, { isWp } from "visual/global/Config";
import { isPro } from "visual/utils/env";

const allTypes = [...proTypes, ...freeTypes];
export const getTypes = (): Type[] => {
  const config = Config.getAll();

  if (isWp(config)) {
    return isPro(config)
      ? allTypes
      : [...freeTypes, ...allTypes.filter((type) => type.proDescription)];
  }

  return allTypes;
};

export const getIconClassName = (icon: Icon): string => {
  switch (icon.type) {
    case TypeId.Outline:
    case TypeId.Glyph: {
      const typeName = getTypes()[icon.type].name;
      return `nc-${typeName} nc-${typeName}-${icon.name}`;
    }
    case TypeId.Fa:
      return `${icon.family ?? "fa"} fa-${icon.name}`;
    case TypeId.Custom:
      return "";
  }
};

export const getCategories = (type: TypeId): Category[] => {
  switch (type) {
    case TypeId.Outline:
    case TypeId.Glyph:
      return ncCats;
    case TypeId.Fa:
      return faCats;
    case TypeId.Custom:
      return [];
  }
};
