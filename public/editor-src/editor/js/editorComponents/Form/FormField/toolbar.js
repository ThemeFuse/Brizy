import _ from "underscore";
import * as types from "./types/index";
import { t } from "visual/utils/i18n";

const getTypeChoices = _.map(types, item => {
  return {
    title: item.componentTitle,
    value: item.componentType
  };
});

export function getItems({ v }) {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      icon: "nc-form-left",
      title: t("Field"),
      position: 60,
      options: [
        {
          id: "type",
          label: t("Field Type"),
          type: "select-dev",
          position: 10,
          devices: "desktop",
          choices: getTypeChoices
        },
        {
          id: "required",
          label: t("Required"),
          type: "switch-dev",
          position: 20,
          devices: "desktop"
        },
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [
              {
                title: "%",
                value: "%"
              }
            ]
          }
        },
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          disabled: v.type !== "Paragraph",
          config: {
            min: 1,
            max: 300,
            units: [
              {
                title: "px",
                value: "px"
              }
            ]
          }
        }
      ]
    }
  ];
}
