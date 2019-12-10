import { t } from "visual/utils/i18n";

export default {
  getItems
};

function getItems() {
  return [
    {
      id: "main",
      type: "group",
      title: t("Image"), // TODO: See if we'll need icons & prop,
      disabled: true,
      items: []
    }
  ];
}
