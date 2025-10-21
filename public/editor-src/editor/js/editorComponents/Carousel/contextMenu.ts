import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";

const getItems = () => [
  {
    id: "main",
    type: "group" as const,
    title: t("Carousel"),
    icon: "nc-carousel",
    disabled: (_: unknown, meta: ComponentsMeta) => meta.isInSubMenu,
    // disabled: (item, meta) => false,
    items: []
  }
];

export default {
  getItems
};
