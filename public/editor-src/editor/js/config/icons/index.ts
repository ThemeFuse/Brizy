import { Category } from "visual/config/icons/Categories";
import { categories as faCats } from "visual/config/icons/categories/fa";
import { categories as ncCats } from "visual/config/icons/categories/nc";
import { Type, TypeId } from "visual/config/icons/Type";
import { types as freeTypes } from "visual/config/icons/types/free";
import { types as proTypes } from "visual/config/icons/types/pro";
import { isWp } from "visual/global/Config";
import { isPro } from "visual/utils/env";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export const getTypes = (config: ConfigCommon): Type[] => {
  const allTypes = [...proTypes(config), ...freeTypes];

  if (isWp(config)) {
    return isPro(config)
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
      return ncCats;
    case TypeId.Fa:
      return faCats;
    case TypeId.Custom:
      return [];
  }
};
