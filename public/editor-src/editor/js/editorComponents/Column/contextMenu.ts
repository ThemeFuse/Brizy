import type { ElementModel } from "visual/component/Elements/Types";
import type { ContextGetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";

export type Value = ElementModel & {
  items: ElementModel[];
};

const getItems: ContextGetItems<Value> = () => {
  return [
    {
      id: "main",
      type: "group",
      title: t("Column"),
      icon: "nc-column",
      items: []
    }
  ];
};

export default {
  getItems
};
