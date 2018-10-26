import { hideToolbar } from "visual/component-new/Toolbar";
import { t } from "visual/utils/i18n";

export default itemIndex => ({
  getItems: getItems(itemIndex)
});

const getItems = itemIndex => (v, component) => {
  const dynamicItems = component.canAddColumn()
    ? [
        {
          id: "duplicate",
          type: "button",
          title: t("Add New Column"),
          onChange() {
            component.addColumn(itemIndex + 1);
          }
        },
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          onChange() {
            component.cloneItem(itemIndex);
          }
        }
      ]
    : [];

  return [
    {
      id: "main",
      type: "group",
      items: [
        ...dynamicItems,
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          onChange() {
            hideToolbar();
            component.removeItem(itemIndex);
          }
        }
      ]
    }
  ];
};
