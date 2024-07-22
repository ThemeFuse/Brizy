import { t } from "visual/utils/i18n";
import { ContextMenuItem } from "../EditorComponent/types";

const getItems = (): ContextMenuItem[] => {
  return [
    {
      id: "main",
      type: "group",
      title: t("Share Button Item"),
      icon: "nc-share-2",
      //@ts-expect-error: Required item
      disabled: (item, meta) => meta.isInSubMenu,
      items: []
    }
  ];
};
export default { getItems };
