import { t } from "visual/utils/i18n";

export default {
  getItems
};

function getItems() {
  return [
    {
      id: "main",
      type: "group",
      title: t("Column"),
      icon: "nc-column",
      items: []
    }
  ];
}
