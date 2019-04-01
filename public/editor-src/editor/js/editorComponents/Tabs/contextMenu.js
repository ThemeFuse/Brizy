import { t } from "visual/utils/i18n";

export default {
  getItems
};

function getItems(v, component) {
  return [
    {
      id: "main",
      type: "group",
      title: t("Tabs"),
      icon: "nc-tabs",
      disabled: (item, meta) => meta.isInSubMenu,
      items: []
    }
  ];
}
