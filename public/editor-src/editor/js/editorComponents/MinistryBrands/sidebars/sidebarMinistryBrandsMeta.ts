import { ElementModel } from "visual/component/Elements/Types";
import { Params } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { getMetaPrefixKey } from "../utils/helpers";

export const getItems = <
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
>(
  data: Params<M, P, S>
): ToolbarItemType[] => {
  const { v, device } = data;
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const metaPrefixKey = getMetaPrefixKey(dvv("metaPrefixKey")) ?? "";

  const marginId = capByPrefix(metaPrefixKey, "margin");
  const paddingId = capByPrefix(metaPrefixKey, "padding");

  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "desktop",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  position: 10,
                  options: [
                    {
                      id: paddingId,
                      type: "padding",
                      label: t("Padding"),
                      devices: "desktop",
                      position: 50
                    },
                    {
                      id: marginId,
                      label: t("Margin"),
                      type: "margin",
                      devices: "desktop",
                      position: 60
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
