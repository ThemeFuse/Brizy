import { ElementModel } from "visual/component/Elements/Types";
import {
  ContextGetItems,
  ContextMenuItem
} from "visual/editorComponents/EditorComponent/types";
import { detectOS } from "visual/utils/dom/detectOS";
import { t } from "visual/utils/i18n";

const os = detectOS();
const isMac = os === "MacOS";

const getItems: (itemIndex: number) => ContextGetItems<ElementModel> =
  (itemIndex: number) =>
  (_, component): ContextMenuItem[] => {
    // @ts-expect-error need transform EditorArrayComponent to ts
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
            helperText: () => (isMac ? "⌘ + C" : "ctrl + C"),
            // @ts-expect-error need transform EditorArrayComponent to ts
            onChange: () => component.copy(itemIndex)
          },
          {
            id: "pasteStyles",
            type: "button",
            title: t("Paste Styles"),
            inactive: !copiedElement,
            helperText: () => (isMac ? "⌘ + ⇧ + V" : "ctrl + ⇧ + V"),
            // @ts-expect-error need transform EditorArrayComponent to ts
            onChange: () => component.pasteStyles(itemIndex)
          }
        ]
      }
    ];
  };

export default (itemIndex: number) => ({
  getItems: getItems(itemIndex)
});
