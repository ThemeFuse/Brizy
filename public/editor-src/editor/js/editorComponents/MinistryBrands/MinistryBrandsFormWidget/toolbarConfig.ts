import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { getOption } from "../utils/helpers";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = () => {
  const ekklesia = Config.getAll()?.modules?.ekklesia;
  const forms = getOption(ekklesia?.forms);

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
                  choices: forms
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
