import { Type, TypeId } from "visual/config/icons/Type";
import { t } from "visual/utils/i18n";

export const types = (isPro: boolean): Type[] => [
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
    proDescription: !isPro
  }
];
