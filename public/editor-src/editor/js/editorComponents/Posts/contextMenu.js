import { t } from "visual/utils/i18n";

export default {
  getItems
};

function getItems(v, component) {
  return [
    {
      id: "main",
      type: "group",
      title: t("Posts"),
      icon: "nc-posts",
      disabled: (item, meta) => meta.isInSubMenu,
      items: []
    }
  ];
}
