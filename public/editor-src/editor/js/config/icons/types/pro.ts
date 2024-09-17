import { Type, TypeId } from "visual/config/icons/Type";
import Config from "visual/global/Config";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";

export const types: Type[] = [
  {
    id: TypeId.Outline,
    name: "outline",
    title: t("Outline"),
    icon: "nc-cube"
  },
  {
    id: TypeId.Glyph,
    name: "glyph",
    title: t("Glyph"),
    icon: "nc-full-cube"
  },
  {
    id: TypeId.Custom,
    name: "custom",
    title: t("Custom"),
    icon: "nc-star",
    proDescription: !isPro(Config.getAll())
  }
];
