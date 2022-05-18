import { hideToolbar } from "visual/component/Toolbar";
import { detectOS } from "visual/utils/dom/detectOS";
import { t } from "visual/utils/i18n";
import { Value } from ".";
import {
  EditorComponent,
  ContextMenuItem
} from "visual/editorComponents/EditorComponent";

const os = detectOS();
const isMac = os === "MacOS";

const getItems = (
  _: Value,
  component: EditorComponent<Value>
): ContextMenuItem[] => {
  return [
    {
      id: "main",
      type: "group",
      items: [
        {
          id: "remove",
          type: "button",
          title: t("Delete"),
          helperText: () => (isMac ? "⌘ + delete" : "Delete"),
          onChange: () => {
            hideToolbar();
            component.selfDestruct();
          }
        }
      ]
    }
  ];
};

export default { getItems };
