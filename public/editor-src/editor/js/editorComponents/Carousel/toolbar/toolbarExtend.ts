import { OnChange } from "visual/component/Options/Type";
import { hideToolbar } from "visual/component/Toolbar";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { ToolbarItemType } from "../../ToolbarItemType";
import { Value } from "../types";

export default function (v: Value, onChange: OnChange<Partial<Value>>) {
  return { getItems: getItems(v, onChange) };
}

export const getItems =
  (v: Value, onChange: (v: Partial<Value>) => void) =>
  ({ device }: { device: ResponsiveMode }): ToolbarItemType[] => {
    const dvv = (key: string) =>
      defaultValueValue({ v, key, device, state: "normal" });
    const columns = dvv("columns");
    const slidesToShow = dvv("slidesToShow");
    const dynamic = dvv("dynamic");

    return [
      {
        id: "duplicate",
        type: "button",
        devices: "desktop",
        config: {
          icon: "nc-duplicate",
          title: t("Duplicate"),
          reverseTheme: true
        },
        roles: ["admin"],
        position: 200,
        onClick: () => {
          onChange({
            columns: ++v.columns
          });
        }
      },
      // @ts-expect-error: Need transform to ts
      ...(dynamic === "on" && columns > slidesToShow && device === "desktop"
        ? [
            {
              id: "remove",
              type: "button",
              devices: "desktop",
              config: {
                title: t("Delete"),
                icon: "nc-trash",
                reverseTheme: true
              },
              roles: ["admin"],
              position: 250,
              onClick: () => {
                hideToolbar();
                onChange({
                  columns: --v.columns
                });
              }
            }
          ]
        : [])
    ];
  };
