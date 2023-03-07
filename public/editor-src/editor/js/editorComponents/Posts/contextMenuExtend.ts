import { ElementModel } from "visual/component/Elements/Types";
import {
  ContextGetItems,
  ContextMenuItem
} from "visual/editorComponents/EditorComponent/types";
import { detectOS } from "visual/utils/dom/detectOS";
import { t } from "visual/utils/i18n";
import type { Editor } from "visual/editorComponents/EditorComponent";

const os = detectOS();
const isMac = os === "MacOS";

const getKeyModifier = (isInSubMenu: boolean): "alt" | "⌘" | "ctrl" => {
  if (isMac) {
    return isInSubMenu ? "alt" : "⌘";
  } else {
    return isInSubMenu ? "alt" : "ctrl";
  }
};

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
              getKeyModifier(isInSubMenu) + " + C",
            // @ts-expect-error need transform EditorArrayComponent to ts
            onChange: () => component.copy(itemIndex)
          },
          {
            id: "pasteStyles",
            type: "button",
            title: t("Paste Styles"),
            helperText: ({ isInSubMenu }) =>
              getKeyModifier(isInSubMenu) + " + ⇧ + V",
            inactive: !canPaste,
            // @ts-expect-error need transform EditorArrayComponent to ts
            onChange: () => component.pasteStyles(itemIndex)
          }
        ]
      }
    ];
  };
