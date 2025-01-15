import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";
import { decodeV } from "../utils.common";
import { tagsFilterLoad } from "./utils.wp";


export function tagsFilter(
  v: ElementModel,
  config: ConfigCommon
): ToolbarItemType[] {
  const accepted = ["posts", "products"];
  const vd = decodeV(v);
  const source = vd.source;

  const filtersIsOff = v.filter === "off";

  return [
    {
      id: "filter-group",
      type: "group",
      disabled: !accepted.includes(vd.type),
      options: [
        {
          id: "filter",
          type: "switch",
          label: t("Tags"),
          devices: "desktop"
        },
        {
          id: "tagsSource",
          type: "select",
          label: t("Source"),
          devices: "desktop",
          disabled: filtersIsOff,
          placeholder: t("Select tags"),
          choices: {
            load: tagsFilterLoad(source, config),
            emptyLoad: { title: t("Don't have tags") }
          }
        },
        {
          id: "masonryFilter",
          type: "switch",
          label: t("Masonry Arrangement"),
          devices: "desktop",
          disabled: filtersIsOff
        }
      ]
    }
  ];
}
