import {
  getDeleteKeySubMenu,
  getKeyModifierSubMenu,
  navigatorKeyModifier
} from "visual/component/ContextMenu/utils";
import { openNavigatorFromContextMenu } from "visual/component/Navigator/utils";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";

export default (itemIndex) => ({
  getItems: getItems(itemIndex)
});

const getItems = (itemIndex) => (v, component) => {
  const dynamicItems = component.canAddColumn()
    ? [
        {
          id: "duplicate",
          type: "button",
          title: t("Add New"),
          helperText: ({ isInSubMenu }) =>
            getKeyModifierSubMenu(isInSubMenu) + " + N",
          onChange() {
            component.addColumn(itemIndex + 1);
          }
        }
      ]
    : [];

  const copiedElement = component.getCurrentCopiedElement();
  const canPaste = copiedElement && copiedElement.type !== "Row";

  return [
    {
      id: "main",
      type: "group",
      items: [
        ...dynamicItems,
        {
          id: "copy",
          type: "button",
          title: t("Copy"),
          helperText: ({ isInSubMenu }) =>
            getKeyModifierSubMenu(isInSubMenu) + " + C",
          onChange: () => component.copy(itemIndex)
        },
        {
          id: "paste",
          type: "button",
          title: t("Paste"),
          helperText: ({ isInSubMenu }) =>
            getKeyModifierSubMenu(isInSubMenu) + " + V",
          inactive: !canPaste,
          onChange: () => component.paste(itemIndex)
        },
        {
          id: "pasteStyles",
          type: "button",
          title: t("Paste Styles"),
          helperText: ({ isInSubMenu }) =>
            getKeyModifierSubMenu(isInSubMenu) + " + ⇧ + V",
          inactive: !canPaste,
          onChange: () => component.pasteStyles(itemIndex)
        },
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          helperText: ({ isInSubMenu }) =>
            getKeyModifierSubMenu(isInSubMenu) + " + D",
          onChange() {
            component.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          helperText: ({ isInSubMenu }) => getDeleteKeySubMenu(isInSubMenu),
          onChange() {
            hideToolbar();
            component.removeItem(itemIndex);
          }
        },
        {
          id: "showNavigator",
          type: "button",
          title: t("Explorer"),
          icon: "nc-navigator",
          helperText: () => navigatorKeyModifier,
          onChange: () => openNavigatorFromContextMenu(component, itemIndex)
        }
      ]
    }
  ];
};
