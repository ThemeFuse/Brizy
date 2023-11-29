import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = () => {
  const config = Config.getAll();

  return [
    {
      id: "toolbarGroupDetail",
      type: "popover-dev",
      config: {
        icon: "t2-group-detail",
        title: t("Form Widget")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          config: {
            saveTab: true
          },
          devices: "desktop",
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "form",
                  label: t("Forms"),
                  type: "select-dev",
                  choices: getEkklesiaChoiches(config, {
                    key: "forms"
                  })
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
