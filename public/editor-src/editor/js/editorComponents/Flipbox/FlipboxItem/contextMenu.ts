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
import { ContextMenuItem } from "visual/editorComponents/EditorComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import { Component, Value } from "./types";

export default (
  itemIndex: number
): { getItems: ReturnType<typeof getItems> } => ({
  getItems: getItems(itemIndex)
});

const getItems =
  (itemIndex: number) =>
  (v: Value[], component: Component): ContextMenuItem[] => {
    const copiedElement = component.getCurrentCopiedElement();

    const containRow = v[itemIndex].type === ElementTypes.Row;
    const canPaste =
      copiedElement && (containRow || v[itemIndex].type === copiedElement.type);

    const canPasteStyles =
      canPaste &&
      (containRow ||
        copiedElement?.value.items[0].type ===
          v[itemIndex].value.items[0].type);

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
            inactive: !canPaste,
            onChange: () => component.paste(itemIndex)
          },
          {
            id: "pasteStyles",
            type: "button",
            title: t("Paste Styles"),
            inactive: !canPasteStyles,
            helperText: () => pasteStylesKeyModifier,
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
