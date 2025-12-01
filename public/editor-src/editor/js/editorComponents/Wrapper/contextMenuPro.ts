import { deleteKeyModifier } from "visual/component/ContextMenu/utils";
import { hideToolbar } from "visual/component/Toolbar";
import type { ContextGetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import type { Value } from "./types";

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
          helperText: () => deleteKeyModifier,
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
