import { Category } from "visual/config/icons/Categories";
import { Type, TypeId } from "visual/config/icons/Type";
import { getCategories as faCats } from "visual/config/icons/categories/fa";
import { getCategories as ncCats } from "visual/config/icons/categories/nc";
import { types as freeTypes } from "visual/config/icons/types/free";
import { types as proTypes } from "visual/config/icons/types/pro";

export const getTypes = (isPro: boolean, isWp: boolean): Type[] => {
  const allTypes = [...proTypes(isPro), ...freeTypes];

  if (isWp) {
    return isPro
      ? allTypes
      : [...freeTypes, ...allTypes.filter((type) => type.proDescription)];
  }

  return allTypes;
};

interface Icon {
  type: string;
  name: string;
  family?: string;
}

export const getIconClassName = (icon: Icon): string => {
  switch (icon.type) {
    case "outline":
    case "glyph": {
      const typeName = icon.type;
      return `nc-${typeName} nc-${typeName}-${icon.name}`;
    }
    case "fa":
      return `${icon.family ?? "fa"} fa-${icon.name}`;
    default:
      return "";
  }
};

export const getCategories = (type: TypeId): Category[] => {
  switch (type) {
    case TypeId.Outline:
    case TypeId.Glyph:
      return ncCats();
    case TypeId.Fa:
      return faCats();
    case TypeId.Custom:
      return [];
  }
};
