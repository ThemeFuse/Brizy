import { hideToolbar } from "visual/component/Toolbar";
import { detectOS } from "visual/utils/dom/detectOS";
import { t } from "visual/utils/i18n";
import type { Value } from ".";
import type { ContextGetItems } from "visual/editorComponents/EditorComponent/types";

const os = detectOS();
const isMac = os === "MacOS";

const getItems: ContextGetItems<Value> = (_, component) => {
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
