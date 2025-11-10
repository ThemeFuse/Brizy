import { get } from "es-toolkit/compat";
import {
  getDeleteKeySubMenu,
  getKeyModifierSubMenu,
  navigatorKeyModifier
} from "visual/component/ContextMenu/utils";
import { ElementModel } from "visual/component/Elements/Types";
import { openNavigatorFromContextMenu } from "visual/component/Navigator/utils";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { ContextGetItems } from "visual/editorComponents/EditorComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default (itemIndex: number) => ({
  getItems: getItems(itemIndex)
});

const getItems =
  (itemIndex: number): ContextGetItems<ElementModel> =>
  (_: ElementModel, component) => {
    if (!(component instanceof EditorArrayComponent)) {
      return [];
    }

    const copiedElement = component.getCurrentCopiedElement();
    const canPaste = get(copiedElement, "type") !== ElementTypes.Row;

    return [
      {
        id: "main",
        type: "group",
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
