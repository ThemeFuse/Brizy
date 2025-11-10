import {
  duplicateKeyModifier,
  getDeleteKeySubMenu,
  getKeyModifierSubMenu,
  navigatorKeyModifier,
  pasteStylesKeyModifier
} from "visual/component/ContextMenu/utils";
import { openNavigatorFromContextMenu } from "visual/component/Navigator/utils";
import { hideToolbar } from "visual/component/Toolbar";
import { ContextMenuItem } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { Component, GetItems, Value } from "../types";

export default (itemIndex: number): GetItems => ({
  getItems: getItems(itemIndex)
});

const getItems =
  (itemIndex: number) =>
  (v: Value[], component: Component): ContextMenuItem[] => {
    const copiedElement = component.getCurrentCopiedElement();
    const canPaste = copiedElement && copiedElement.type === v[itemIndex].type;

    return [
      {
        id: "main",
        type: "group",
        title: t("Share Button"),
        items: [
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
              getKeyModifierSubMenu(isInSubMenu) + " + ⇧ + V",
            inactive: !canPaste,
            onChange: () => component.paste(itemIndex)
          },
          {
            id: "pasteStyles",
            type: "button",
            title: t("Paste Styles"),
            inactive: !canPaste,
            helperText: () => pasteStylesKeyModifier,
            onChange: () => {
              component.pasteStyles(itemIndex);
            }
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
            helperText: ({ isInSubMenu }) => getDeleteKeySubMenu(isInSubMenu),
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
