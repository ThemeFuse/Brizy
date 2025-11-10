import {
  copyKeyModifier,
  deleteKeyModifier,
  duplicateKeyModifier,
  navigatorKeyModifier,
  pasteKeyModifier,
  pasteStylesKeyModifier
} from "visual/component/ContextMenu/utils";
import { openNavigatorFromContextMenu } from "visual/component/Navigator/utils";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";

export default (itemIndex) => ({
  getItems: getItems(itemIndex)
});

const getItems = (itemIndex) => (v, component) => {
  const copiedElement = component.getCurrentCopiedElement();

  return [
    {
      id: "main",
      type: "group",
      items: [
        {
          id: "copy",
          type: "button",
          title: t("Copy"),
          helperText: () => copyKeyModifier,
          onChange: () => component.copy(itemIndex)
        },
        {
          id: "paste",
          type: "button",
          title: t("Paste"),
          helperText: () => pasteKeyModifier,
          inactive: !copiedElement || copiedElement.type === "SectionMegaMenu",
          onChange: () => component.paste(itemIndex)
        },
        {
          id: "pasteStyles",
          type: "button",
          title: t("Paste Styles"),
          helperText: () => pasteStylesKeyModifier,
          inactive: !copiedElement,
          onChange: () => component.pasteStyles(itemIndex)
        },
        {
          id: "duplicate",
          type: "button",
          title: t("Duplicate"),
          helperText: () => duplicateKeyModifier,
          onChange: () => {
            component.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          helperText: () => deleteKeyModifier,
          onChange: () => {
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
