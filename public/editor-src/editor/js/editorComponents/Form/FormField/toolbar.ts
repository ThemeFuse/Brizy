import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./type";
import { getTypeChoices } from "./utils";

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const inputTypes = getTypeChoices();

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        title: t("Field"),
        icon: "nc-form-left"
      },
      position: 60,
      options: [
        {
          id: "type",
          label: t("Field Type"),
          type: "select",
          position: 10,
          devices: "desktop",
          choices: inputTypes
        },
        {
          id: "required",
          label: t("Required"),
          type: "switch",
          position: 20,
          devices: "desktop"
        },
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ title: "%", value: "%" }]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider",
          disabled: dvv("type") !== "Paragraph",
          config: {
            min: 1,
            max: 300,
            units: [{ title: "px", value: "px" }]
          }
        }
      ]
    }
  ];
};
