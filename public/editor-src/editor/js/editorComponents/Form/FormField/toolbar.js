import _ from "underscore";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import * as types from "./types/index";

const getTypeChoices = _.map(types, (item) => {
  return {
    title: item.componentTitle,
    value: item.componentType
  };
});

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

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
          choices: getTypeChoices
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
}
