import { t } from "visual/utils/i18n";

export default {
  getItems
};

function getItems() {
  return [
    {
      id: "main",
      type: "group",
      title: t("Switcher"),
      icon: "nc-switcher",
      disabled: (item, meta) => meta.isInSubMenu,
      items: []
    }
  ];
}
