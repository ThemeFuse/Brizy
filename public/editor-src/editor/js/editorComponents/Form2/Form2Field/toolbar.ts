import _ from "underscore";
import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import * as types from "./types/index";

export function getItems({
  v,
  device
}: {
  v: ElementModel;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

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

  const isCheckboxOrRadio = isCheckbox || isRadio;
  const isDateOrTime = isDate || isTime;

  const fileUploadSizes: { title: string; value: string }[] = [];
  if (isFileUpload) {
    const { maxUploadFileSize } = Config.getAll().server || {};
    const maxFileUpload = Number(maxUploadFileSize);
    for (let idx = 1; idx <= maxFileUpload; idx++) {
      fileUploadSizes.push({ title: `${idx} MB`, value: `${idx}mb` });
    }
  }

  const dateOrTimeOptions = (): ToolbarItemType[] => [
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
  ];
  const checkboxOrRadioOptions = (): ToolbarItemType[] => [
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
  ];
  const fileUploadOptions = (): ToolbarItemType[] => [
    {
      id: "fileMaxSize",
      label: t("Max. File Size"),
      type: "select-dev",
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
  ];
  const selectOptions = (): ToolbarItemType[] => [
    {
      id: "multipleSelection",
      label: t("Multiple Selection"),
      type: "switch-dev",
      position: 20,
      disabled: !isSelect,
      devices: "desktop"
    }
  ];
  const numberOptions = (): ToolbarItemType[] => [
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
  ];
  const hiddenOptions = (): ToolbarItemType[] => [
    {
      id: "required",
      label: t("Required"),
      type: "switch-dev",
      position: 100,
      disabled: isHidden,
      devices: "desktop"
    }
  ];
  const checkboxOrRadioAdvanced = (): ToolbarItemType[] => [
    {
      id: "placeholder",
      type: "switch-dev",
      disabled: true
    }
  ];
  const checkboxOrRadioBg = (): ToolbarItemType[] => [
    {
      id: "size",
      type: "radioGroup-dev",
      disabled: true,
      choices: []
    },
    {
      id: "borderRadius",
      type: "slider-dev",
      disabled: true
    }
  ];
  const checkboxOrRadioSize = (): ToolbarItemType[] => [
    {
      id: "size",
      type: "radioGroup-dev",
      disabled: true,
      choices: []
    }
  ];
  const checkboxOrRadioPopover = (): ToolbarItemType[] => [
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
  ];
  const checkboxPopover = (): ToolbarItemType[] => [
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
  ];
  const heightOption = (): ToolbarItemType[] => [
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
  ];

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
                  choices: _.map(types, (item) => ({
                    title: item.componentTitle,
                    value: item.componentType
                  }))
                },
                {
                  id: "fileSizeErrorMessage",
                  type: "inputText-dev",
                  position: 15,
                  label: "File size error message",
                  placeholder: "..type error message",
                  devices: "desktop",
                  disabled: !isFileUpload
                },
                {
                  id: "fileTypeErrorMessage",
                  type: "inputText-dev",
                  position: 15,
                  label: "File type error message",
                  placeholder: "..type error message",
                  devices: "desktop",
                  disabled: !isFileUpload
                },
                {
                  id: "numberMinMessage",
                  type: "inputText-dev",
                  position: 15,
                  label: "Min number error message",
                  placeholder: "..type error message",
                  devices: "desktop",
                  disabled: !isNumber
                },
                {
                  id: "numberMaxMessage",
                  type: "inputText-dev",
                  position: 15,
                  label: "Max number error message",
                  placeholder: "..type error message",
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
              options: [...(isCheckboxOrRadio ? checkboxOrRadioAdvanced() : [])]
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
        ...(isParagraph ? heightOption() : []),
        {
          id: "styles",
          type: "sidebarTabsButton-dev",
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
}
