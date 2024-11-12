import { Type, TypeId } from "visual/config/icons/Type";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export const types = (config: ConfigCommon): Type[] => [
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
    proDescription: !isPro(config)
  }
];
