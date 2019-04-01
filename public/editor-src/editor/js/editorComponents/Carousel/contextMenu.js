import { t } from "visual/utils/i18n";

export default {
  getItems
};

function getItems(v, component) {
  return [
    {
      id: "main",
      type: "group",
      title: t("Carousel"),
      icon: "nc-carousel",
      disabled: (item, meta) => meta.isInSubMenu,
      // disabled: (item, meta) => false,
      items: []
    }
  ];
}
