import { t } from "visual/utils/i18n";
import _ from "underscore";
import Config from "visual/global/Config";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import * as types from "./types/index";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device });
  const dvv = key => defaultValueValue({ v, key, device });

  const isCheckbox = v.type === "Checkbox";
  const isRadio = v.type === "Radio";
  const isDate = v.type === "Date";
  const isTime = v.type === "Time";
  const isFileUpload = v.type === "FileUpload";
  const isSelect = v.type === "Select";
  const isHidden = v.type === "Hidden";
  const isNumber = v.type === "Number";
  const isParagraph = v.type === "Paragraph";

  const isCheckboxOrRadio = isCheckbox || isRadio;
  const isDateOrTime = isDate || isTime;

  let fileUploadSizes = [];
  if (isFileUpload) {
    const { maxUploadSize } = Config.get("server") || {};
    const maxFileUpload = Number(maxUploadSize);
    for (let idx = 1; idx <= maxFileUpload; idx++) {
      fileUploadSizes.push({ title: `${idx} MB`, value: `${idx}mb` });
    }
  }

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-form-left",
        title: t("Field")
      },
      position: 60,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "field",
              label: t("Field"),
              options: [
                {
                  id: "type",
                  label: t("Type"),
                  type: "select-dev",
                  devices: "desktop",
                  position: 10,
                  choices: _.map(types, item => ({
                    title: item.componentTitle,
                    value: item.componentType
                  }))
                },
                ...(isDateOrTime
                  ? [
                      {
                        id: "min",
                        type: "inputText-dev",
                        position: 20,
                        label: isDate ? t("Min Date") : t("Min Time"),
                        placeholder: isDate ? "YYYY-MM-DD" : "HH:MM",
                        devices: "desktop"
                      },
                      {
                        id: "max",
                        type: "inputText-dev",
                        position: 30,
                        label: isDate ? t("Max Date") : t("Max Time"),
                        placeholder: isDate ? "YYYY-MM-DD" : "HH:MM",
                        devices: "desktop"
                      },
                      {
                        id: "nativeHtml",
                        type: "switch-dev",
                        position: 40,
                        label: t("Native HTML5"),
                        devices: "desktop"
                      }
                    ]
                  : []),

                ...(isCheckboxOrRadio
                  ? [
                      {
                        id: "columns",
                        label: t("Columns"),
                        type: "select-dev",
                        position: 20,
                        choices: [
                          { title: "1", value: 1 },
                          { title: "2", value: 2 },
                          { title: "3", value: 3 },
                          { title: "4", value: 4 },
                          { title: "5", value: 5 },
                          { title: "6", value: 6 }
                        ]
                      }
                    ]
                  : []),

                ...(isFileUpload
                  ? [
                      {
                        id: "fileMaxSize",
                        label: t("Max. File Size"),
                        type: "select-dev",
                        devices: "desktop",
                        position: 20,
                        helper: t(
                          "If you need to increase max upload size please contact your hosting."
                        ),
                        choices: fileUploadSizes
                      },
                      {
                        id: "fileTypes",
                        label: t("Allowed File Types"),
                        type: "inputText-dev",
                        devices: "desktop",
                        position: 30,
                        config: {
                          size: "medium"
                        },
                        helper: {
                          content: t(
                            "Enter the allowed file types, separated by a comma (jpg, gif, pdf, etc)."
                          )
                        }
                      }
                    ]
                  : []),

                ...(isSelect
                  ? [
                      {
                        id: "multipleSelection",
                        label: t("Multiple Selection"),
                        type: "switch-dev",
                        position: 20,
                        disabled: v.type !== "Select",
                        devices: "desktop"
                      }
                    ]
                  : []),

                ...(isNumber
                  ? [
                      {
                        id: "min",
                        type: "inputText-dev",
                        position: 20,
                        label: t("Min"),
                        placeholder: t("Min"),
                        devices: "desktop"
                      },
                      {
                        id: "max",
                        type: "inputText-dev",
                        position: 30,
                        label: t("Max"),
                        placeholder: t("Max"),
                        devices: "desktop"
                      }
                    ]
                  : []),

                ...(!isHidden
                  ? [
                      {
                        id: "required",
                        label: t("Required"),
                        type: "switch-dev",
                        position: 100,
                        disabled: dvv("type") === "Hidden",
                        devices: "desktop"
                      }
                    ]
                  : [])
              ]
            },
            {
              id: "advanced",
              label: t("Advanced"),
              options: [
                ...(isCheckboxOrRadio
                  ? [
                      {
                        id: "placeholder",
                        type: "switch-dev",
                        disabled: true
                      }
                    ]
                  : [])
              ]
            },
            {
              id: "background",
              label: t("Background"),
              options: [
                ...(isCheckboxOrRadio
                  ? [
                      {
                        id: dvk("size"),
                        type: "radioGroup",
                        disabled: true
                      },
                      {
                        id: dvk("borderRadius"),
                        type: "slider",
                        disabled: true
                      }
                    ]
                  : [])
              ]
            }
          ]
        },

        ...(isCheckboxOrRadio
          ? [
              {
                id: dvk("size"),
                type: "radioGroup",
                disabled: true
              }
            ]
          : [])
      ]
    },

    ...(isCheckboxOrRadio
      ? [
          {
            id: "toolbarTypography",
            type: "popover-dev",
            disabled: true
          },
          {
            id: "toolbarColor",
            type: "popover-dev",
            disabled: true
          }
        ]
      : [
          {
            id: "toolbarTypographyCheckbox",
            type: "popover-dev",
            disabled: true
          },
          {
            id: "toolbarColorCheckbox",
            type: "popover-dev",
            disabled: true
          }
        ]),

    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          position: 30,
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },

        ...(isParagraph
          ? [
              {
                id: "height",
                label: t("Height"),
                type: "slider-dev",
                devices: "desktop",
                position: 40,
                config: {
                  min: 1,
                  max: 300,
                  units: [{ value: "px", title: "px" }]
                }
              }
            ]
          : [])
      ]
    }
  ];
}
