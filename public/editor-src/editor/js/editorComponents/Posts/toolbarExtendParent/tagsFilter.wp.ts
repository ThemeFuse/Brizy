import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { decodeV } from "../utils.common";
import { tagsFilterLoad } from "./utils.wp";

export function tagsFilter(v: ElementModel): ToolbarItemType[] {
  const accepted = ["posts", "products"];
  const vd = decodeV(v);
  const source = vd.source;

  return [
    {
      id: "filter-group",
      type: "group-dev",
      disabled: !accepted.includes(vd.type),
      options: [
        {
          id: "filter",
          type: "switch-dev",
          label: t("Tags"),
          devices: "desktop"
        },
        {
          id: "tagsSource",
          type: "select-dev",
          label: t("Source"),
          devices: "desktop",
          disabled: v.filter === "off",
          placeholder: t("Select tags"),
          choices: {
            load: tagsFilterLoad(source),
            emptyLoad: { title: t("Don't have tags") }
          }
        }
      ]
    }
  ];
}
