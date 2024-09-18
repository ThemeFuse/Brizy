import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import {
  isViewType,
  isViewTypeWithIcon
} from "visual/editorComponents/Form2/utils";
import { t } from "visual/utils/i18n";
import { Str } from "@brizy/readers";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ component }) => {
  const viewType = Str.read(component.props.viewType) ?? "";

  const hasIcon = isViewType(viewType) && isViewTypeWithIcon(viewType);

  return [
    {
      id: "toolbarFormStep",
      type: "popover",
      config: {
        icon: "nc-form-left",
        title: t("Form")
      },
      position: 10,
      options: [
        {
          id: "toolbarSteps",
          type: "tabs",
          tabs: [
            {
              id: "tabsIcon",
              label: t("Icon"),
              options: [
                {
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: "desktop",
                  disabled: !hasIcon
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
