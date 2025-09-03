import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { Props, Value } from "../type";
import { getThirtyOptions, inputTypesChoice } from "../utils";

export const getItems: GetItems<Value, Props> = ({ v, device, component }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const config = component.getGlobalConfig();
  const context = component.context;

  const type = dvv("type");

  const isCheckbox = type === "Checkbox";
  const isRadio = type === "Radio";
  const isDate = type === "Date";
  const isTime = type === "Time";
  const isFileUpload = type === "FileUpload";
  const isSelect = type === "Select";
  const isHidden = type === "Hidden";
  const isNumber = type === "Number";
  const isParagraph = type === "Paragraph";

  const thirtyOption = config.integrations?.form?.fields;
  const thirtyOptionHandler = thirtyOption?.handler;
  const thirtyOptionLabel = thirtyOption?.label ?? t("Field Name");
  const fieldId = component.getId();

  const isCheckboxOrRadio = isCheckbox || isRadio;
  const isDateOrTime = isDate || isTime;

  const fileUploadSizes: { title: string; value: string }[] = [];
  if (isFileUpload) {
    const { maxUploadFileSize } = config.server || {};
    const maxFileUpload = Number(maxUploadFileSize);
    for (let idx = 1; idx <= maxFileUpload; idx++) {
      fileUploadSizes.push({ title: `${idx} MB`, value: `${idx}mb` });
    }
  }

  const choices = config.elements?.form?.inputTypes;
  const inputTypes = inputTypesChoice(choices, t);

  const dateOrTimeOptions = (): ToolbarItemType[] => [
    {
      id: "min",
      type: "inputText",
      position: 20,
      label: isDate ? t("Min Date") : t("Min Time"),
      placeholder: isDate ? t("YYYY-MM-DD") : t("HH:MM"),
      devices: "desktop"
    },
    {
      id: "max",
      type: "inputText",
      position: 30,
      label: isDate ? t("Max Date") : t("Max Time"),
      placeholder: isDate ? t("YYYY-MM-DD") : t("HH:MM"),
      devices: "desktop"
    },
    {
      id: "nativeHtml",
      type: "switch",
      position: 40,
      label: t("Native HTML5"),
      devices: "desktop"
    }
  ];
  const checkboxOrRadioOptions = (): ToolbarItemType[] => [
    {
      id: "columns",
      label: t("Columns"),
      type: "select",
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
  ];
  const fileUploadOptions = (): ToolbarItemType[] => [
    {
      id: "fileMaxSize",
      label: t("Max. File Size"),
      type: "select",
      devices: "desktop",
      position: 20,
      helper: {
        content: t(
          "If you need to increase max upload size please contact your hosting."
        )
      },
      choices: fileUploadSizes
    },
    {
      id: "fileTypes",
      label: t("Allowed File Types"),
      type: "inputText",
      devices: "desktop",
      position: 30,
      helper: {
        content: t(
          "Enter the allowed file types, separated by a comma (jpg, gif, pdf, etc)."
        )
      }
    }
  ];
  const selectOptions = (): ToolbarItemType[] => [
    {
      id: "multipleSelection",
      label: t("Multiple Selection"),
      type: "switch",
      position: 20,
      disabled: !isSelect,
      devices: "desktop"
    }
  ];
  const numberOptions = (): ToolbarItemType[] => [
    {
      id: "min",
      type: "inputText",
      position: 20,
      label: t("Min"),
      placeholder: t("Min"),
      devices: "desktop"
    },
    {
      id: "max",
      type: "inputText",
      position: 30,
      label: t("Max"),
      placeholder: t("Max"),
      devices: "desktop"
    }
  ];
  const hiddenOptions = (): ToolbarItemType[] => [
    {
      id: "required",
      label: t("Required"),
      type: "switch",
      position: 100,
      disabled: isHidden,
      devices: "desktop"
    }
  ];
  const checkboxOrRadioAdvanced = (): ToolbarItemType[] => [
    {
      id: "placeholder",
      type: "switch",
      disabled: true
    }
  ];
  const checkboxOrRadioBg = (): ToolbarItemType[] => [
    {
      id: "size",
      type: "radioGroup",
      disabled: true,
      choices: []
    },
    {
      id: "borderRadius",
      type: "slider",
      disabled: true
    }
  ];
  const checkboxOrRadioSize = (): ToolbarItemType[] => [
    {
      id: "size",
      type: "radioGroup",
      disabled: true,
      choices: []
    }
  ];
  const checkboxOrRadioPopover = (): ToolbarItemType[] => [
    {
      id: "toolbarTypography",
      type: "popover",
      disabled: true
    },
    {
      id: "toolbarColor",
      type: "popover",
      disabled: true
    }
  ];
  const checkboxPopover = (): ToolbarItemType[] => [
    {
      id: "toolbarTypographyCheckbox",
      type: "popover",
      disabled: true
    },
    {
      id: "toolbarColorCheckbox",
      type: "popover",
      disabled: true
    }
  ];
  const heightOption = (): ToolbarItemType[] => [
    {
      id: "height",
      label: t("Height"),
      type: "slider",
      devices: "desktop",
      position: 40,
      config: {
        min: 1,
        max: 300,
        units: [{ value: "px", title: "px" }]
      }
    }
  ];

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      config: {
        icon: "nc-form-left",
        title: t("Field")
      },
      position: 60,
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: "field",
              label: t("Field"),
              options: [
                {
                  id: "type",
                  label: t("Type"),
                  type: "select",
                  devices: "desktop",
                  position: 10,
                  disabled: inputTypes.length === 0,
                  choices: inputTypes
                },
                {
                  id: "defaultValue",
                  label: t("Default Value"),
                  type: "inputText",
                  devices: "desktop",
                  config: {
                    size: "medium"
                  },
                  disabled: isFileUpload,
                  position: 11,
                  helper: {
                    content:
                      isCheckbox || isSelect
                        ? t(
                            "Enter the default value for the field. If needed, use a comma-separated list. For example, 'Option 1,Option 2'"
                          )
                        : t("Enter the default value for the field.")
                  },
                  population: richTextDC
                },
                {
                  id: "fileSizeErrorMessage",
                  type: "inputText",
                  position: 15,
                  label: t("File size error message"),
                  placeholder: t("..type error message"),
                  devices: "desktop",
                  disabled: !isFileUpload
                },
                {
                  id: "fileTypeErrorMessage",
                  type: "inputText",
                  position: 15,
                  label: t("File type error message"),
                  placeholder: t("..type error message"),
                  devices: "desktop",
                  disabled: !isFileUpload
                },
                {
                  id: "numberMinMessage",
                  type: "inputText",
                  position: 15,
                  label: t("Min number error message"),
                  placeholder: t("..type error message"),
                  devices: "desktop",
                  disabled: !isNumber
                },
                {
                  id: "numberMaxMessage",
                  type: "inputText",
                  position: 15,
                  label: t("Max number error message"),
                  placeholder: t("..type error message"),
                  devices: "desktop",
                  disabled: !isNumber
                },
                ...(isDateOrTime ? dateOrTimeOptions() : []),
                ...(isCheckboxOrRadio ? checkboxOrRadioOptions() : []),
                ...(isFileUpload ? fileUploadOptions() : []),
                ...(isSelect ? selectOptions() : []),
                ...(isNumber ? numberOptions() : []),
                ...(!isHidden ? hiddenOptions() : [])
              ]
            },
            {
              id: "advanced",
              label: t("Advanced"),
              options: [
                ...(isCheckboxOrRadio ? checkboxOrRadioAdvanced() : []),
                {
                  id: "customFieldName",
                  type: "select",
                  label: thirtyOptionLabel,
                  disabled: typeof thirtyOptionHandler !== "function",
                  choices: {
                    load: getThirtyOptions(fieldId, config)
                  }
                }
              ]
            },
            {
              id: "background",
              label: t("Background"),
              options: [...(isCheckboxOrRadio ? checkboxOrRadioBg() : [])]
            }
          ]
        },
        ...(isCheckboxOrRadio ? checkboxOrRadioSize() : [])
      ]
    },
    ...(isCheckboxOrRadio ? checkboxOrRadioPopover() : checkboxPopover()),
    {
      id: "toolbarSettings",
      type: "popover",
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
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        ...(isParagraph ? heightOption() : []),
        {
          id: "styles",
          type: "sidebarTabsButton",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    }
  ];
};
