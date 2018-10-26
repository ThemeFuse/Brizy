import { hideToolbar } from "visual/component-new/Toolbar";
import { t } from "visual/utils/i18n";

export default itemIndex => ({
  getItems: getItems(itemIndex)
});

const getItems = itemIndex => (v, component) => {
  return [
    {
      id: "main",
      type: "group",
      items: [
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          onChange: () => {
            component.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          onChange: () => {
            hideToolbar();
            component.removeItem(itemIndex);
          }
        }
      ]
    }
  ];
};
