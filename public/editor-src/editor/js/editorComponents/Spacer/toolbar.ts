import { Params } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types";

export function getItems({ v, device }: Params<Value>): ToolbarItemType[] {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  return [
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          config: {
            min: dvv("heightSuffix") === "px" ? 10 : 1,
            max: dvv("heightSuffix") === "px" ? 200 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "vh", title: "vh" },
              { value: "em", title: "em" }
            ]
          }
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    }
  ];
}
