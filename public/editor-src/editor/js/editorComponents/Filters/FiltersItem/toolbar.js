import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { toolbarBgImage } from "visual/utils/toolbar";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export default ({ filterType, checkboxType, dataSource }) => ({
  getItems: getItems({
    filterType,
    checkboxType,
    dataSource
  })
});

export const getItems = ({ filterType, checkboxType, dataSource }) => ({
  v,
  device,
  state
}) => {
  const dvv = key => defaultValueValue({ v, key, device });

  const { hex: checkStyle3BgColor } = getOptionColorHexByPalette(
    dvv("checkStyle3BgColorHex"),
    dvv("checkStyle3BgColorPalette")
  );

  const dynamicContent = dataSource !== "manual";
  const manualContent = dataSource === "manual";
  const isCheckbox = filterType === "checkbox";
  const isCheckrange = filterType === "checkrange";
  const isSelect = filterType === "select";
  const isRadio = filterType === "radio";
  const style1 = checkboxType === "style-1";
  const style2 = checkboxType === "style-2";
  const style3 = checkboxType === "style-3";
  const style4 = checkboxType === "style-4";

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-filters",
        title: t("Filter")
      },
      position: 10,
      devices: "desktop",
      options: [
        {
          id: "itemsTabs",
          type: "tabs",
          tabs: [
            {
              id: "filter",
              label: "Filter",
              position: 20,
              options: [
                {
                  id: "selectDataSource",
                  label: t("Data Source"),
                  type: "select-dev",
                  disabled: !isSelect,
                  position: 20,
                  choices: [
                    { value: "manual", title: "Manual Input" },
                    { value: "taxonomies", title: "Taxonomies" },
                    { value: "posts", title: "Posts" },
                    { value: "custom", title: "Custom" }
                  ]
                }
              ]
            },
            {
              id: "item",
              label: "Items",
              position: 40,
              options: [
                {
                  id: "spacing",
                  type: "slider-dev",
                  disabled: true
                }
              ]
            },
            {
              id: "items",
              label: "Item",
              position: 60,
              options: [
                {
                  id: "checkRangeMin",
                  label: t("Min"),
                  type: "number-dev",
                  disabled: !isCheckrange,
                  config: {
                    min: 0,
                    max: 9999999999,
                    size: "large"
                  }
                },
                {
                  id: "checkRangeMax",
                  label: t("Max"),
                  type: "number-dev",
                  disabled: !isCheckrange,
                  config: {
                    min: 0,
                    max: 9999999999,
                    size: "large"
                  }
                },
                (isCheckbox || isRadio) && (style1 || style2 || style3)
                  ? {
                      id: "checkLabel",
                      label: t("Label"),
                      type: "inputText-dev",
                      position: 20,
                      placeholder: t("Label")
                    }
                  : {},
                isCheckrange
                  ? {
                      id: "checkRangeLabel",
                      label: t("Label"),
                      type: "inputText-dev",
                      position: 20,
                      placeholder: t("Label")
                    }
                  : {},
                style1 || style2 || ((style3 || style4) && manualContent)
                  ? {
                      id: "checkValue",
                      label: t("Value"),
                      type: "inputText-dev",
                      position: 20,
                      placeholder: t("Value"),
                      disabled: !(isCheckbox || isRadio)
                    }
                  : {},
                (style3 || style4) && dynamicContent
                  ? {
                      id: "checkSelectValue",
                      label: t("Value"),
                      type: "select-dev",
                      disabled: !(isCheckbox || isRadio),
                      config: {
                        size: "large"
                      },
                      choices: [
                        { value: "AA", title: "AA" },
                        { value: "BB", title: "BB" }
                      ]
                    }
                  : {},
                (isCheckbox || isRadio) && style4
                  ? toolbarBgImage({
                      v,
                      device,
                      state,
                      onChange: [
                        "onChangeBgImage",
                        "onChangeBgImageBgOpacity",
                        "onChangeBgImageDependencies",
                        "onChangeBgImageColumnAndRowSyncMobile"
                      ]
                    })
                  : {}
              ]
            }
          ]
        }
      ]
    },
    (isCheckbox || isRadio) && style3
      ? {
          id: "popoverColor",
          type: "popover-dev",
          config: {
            size: "auto",
            title: t("Colors"),
            icon: {
              style: {
                backgroundColor: hexToRgba(
                  checkStyle3BgColor,
                  v.checkStyle3BgColorOpacity
                )
              }
            }
          },
          devices: "desktop",
          position: 90,
          options: [
            {
              id: "tabsColor",
              type: "tabs-dev",
              tabs: [
                {
                  id: "tabBgCheckStyle3",
                  label: t("Bg"),
                  options: [
                    {
                      id: "checkStyle3BgColor",
                      type: "colorPicker-dev",
                      states: [NORMAL, HOVER]
                    }
                  ]
                },
                {
                  id: "Border",
                  label: t("Border"),
                  options: [
                    {
                      id: "checkStyle3Border",
                      type: "border-dev",
                      states: [NORMAL, HOVER]
                    }
                  ]
                },
                {
                  id: "tabCheckIconBoxShadow",
                  label: t("Shadow"),
                  options: [
                    {
                      id: "checkStyle3BoxShadow",
                      type: "boxShadow-dev",
                      devices: "desktop",
                      states: [NORMAL, HOVER]
                    }
                  ]
                },
                {
                  id: "tabBgCheckbox",
                  label: t("Bg"),
                  options: [
                    {
                      id: "checkboxBgColor",
                      type: "colorPicker-dev",
                      disabled: true
                    }
                  ]
                },
                {
                  id: "tabCheckboxBorder",
                  label: t("Border"),
                  options: [
                    {
                      id: "checkboxBorder",
                      type: "border-dev",
                      disabled: true
                    }
                  ]
                },
                {
                  id: "tabCheckboxBoxShadow",
                  label: t("Shadow"),
                  options: [
                    {
                      id: "checkboxBoxShadow",
                      type: "boxShadow-dev",
                      disabled: true
                    }
                  ]
                }
              ]
            }
          ]
        }
      : {},
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        style1 || style2 || style4
          ? {
              id: "checkColorSize",
              type: "slider-dev",
              disabled: true
            }
          : {},
        style1 || style2 || style3
          ? {
              id: "imgWidth",
              type: "slider-dev",
              disabled: true
            }
          : {},
        style1 || style2 || style3
          ? {
              id: "imgHeight",
              type: "slider-dev",
              disabled: true
            }
          : {}
      ]
    }
  ];
};
