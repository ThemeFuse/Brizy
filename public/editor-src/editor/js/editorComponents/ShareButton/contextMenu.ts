import { t } from "visual/utils/i18n";
import type { ContextMenuItem } from "../EditorComponent/types";

const getItems = (): ContextMenuItem[] => {
  return [
    {
      id: "main",
      type: "group",
      title: t("Share Button Item"),
      icon: "nc-share-2",
      disabled: (_item, meta) => meta.isInSubMenu,
      items: []
    }
  ];
};
export default { getItems };
