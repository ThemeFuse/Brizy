import { Str } from "@brizy/readers";
import { isFunction } from "es-toolkit";
import type { ElementModel } from "visual/component/Elements/Types";
import type { ContextGetItems } from "visual/editorComponents/EditorComponent/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import { getTranslationsMap } from "../Wrapper/contextMenu";

const getItems: ContextGetItems<ElementModel> = (v) => {
  const _title = getTranslationsMap()[ElementTypes.Posts];
  const title = isFunction(_title) ? _title(v) : _title;

  return [
    {
      id: "main",
      type: "group",
      title: Str.read(title) ?? t("Posts"),
      icon: "nc-posts",
      disabled: (_, meta) => meta.isInSubMenu,
      items: []
    }
  ];
};

export default {
  getItems
};
