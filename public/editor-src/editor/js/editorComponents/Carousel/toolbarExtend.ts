import { ElementModel } from "visual/component/Elements/Types";
import { hideToolbar } from "visual/component/Toolbar/index";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ToolbarItemType } from "../ToolbarItemType";

export type Value = ElementModel & {
  columns: number;
  slidesToShow: number;
};

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });
  const columns = dvv("columns");
  const slidesToShow = dvv("slidesToShow");

  return [
    {
      id: "duplicate",
      // @ts-expect-error: Need transform to ts
      type: "button",
      devices: "desktop",
      icon: "nc-duplicate",
      title: t("Duplicate"),
      roles: ["admin"],
      position: 200,
      onChange: () => {
        return {
          columns: ++v.columns
        };
      }
    },
    // @ts-expect-error: Need transform to ts
    ...(columns > slidesToShow && device === "desktop"
      ? [
          {
            id: "remove",
            type: "button",
            devices: "desktop",
            title: t("Delete"),
            roles: ["admin"],
            icon: "nc-trash",
            position: 250,
            onChange: () => {
              hideToolbar();

              return {
                columns: --v.columns
              };
            }
          }
        ]
      : [])
  ];
}
