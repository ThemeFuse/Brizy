import { t } from "visual/utils/i18n";

const translationsMap = {
  Button: t("Button"),
  Icon: t("Icon")
};

export default {
  getItems
};

function getItems(v, component) {
  return [
    {
      id: "main",
      type: "group",
      title: translationsMap[v[0].type], // TODO: See if we'll need icons & prop
      items: []
    }
  ];
}
