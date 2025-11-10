import {
  getKeyModifierSubMenu,
  navigatorKeyModifier
} from "visual/component/ContextMenu/utils";
import { ElementModel } from "visual/component/Elements/Types";
import { openNavigatorFromContextMenu } from "visual/component/Navigator/utils";
import type { Editor } from "visual/editorComponents/EditorComponent";
import {
  ContextGetItems,
  ContextMenuItem
} from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";

type GetItems = {
  getItems: ContextGetItems<ElementModel>;
};

export default (itemIndex: number): GetItems => ({
  getItems: getItems(itemIndex)
});

const getItems =
  (itemIndex: number) =>
  (_: ElementModel, component: Editor<ElementModel>): ContextMenuItem[] => {
    // @ts-expect-error need transform EditorArrayComponent to ts
    const copiedElement = component.getCurrentCopiedElement();
    const canPaste = copiedElement && copiedElement.type !== "Row";

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
            // @ts-expect-error need transform EditorArrayComponent to ts
            onChange: () => component.copy(itemIndex)
          },
          {
            id: "pasteStyles",
            type: "button",
            title: t("Paste Styles"),
            helperText: ({ isInSubMenu }) =>
              getKeyModifierSubMenu(isInSubMenu) + " + ⇧ + V",
            inactive: !canPaste,
            // @ts-expect-error need transform EditorArrayComponent to ts
            onChange: () => component.pasteStyles(itemIndex)
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
