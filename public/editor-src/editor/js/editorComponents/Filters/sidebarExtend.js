import { t } from "visual/utils/i18n";

export const title = t("Filter Item");

export function getItems({ v }) {
  const checkRadioDisabled =
    v.filterType === "checkbox" ||
    v.filterType === "radio" ||
    v.filterType === "checkrange";

  const isActive = v.filterType === "active";
  const isRange = v.filterType === "range";
  const style1 = v.checkboxType === "style-1";
  const style2 = v.checkboxType === "style-2";
  const style3 = v.checkboxType === "style-3";
  const style4 = v.checkboxType === "style-4";

  return [
    {
      id: "settingsTabs",
      type: "tabs-dev",
      config: {
        align: "start"
      },
      devices: "desktop",
      tabs: [
        {
          id: "settingsStyling",
          label: t("Styling"),
          icon: "nc-styling",
          options: [
            (checkRadioDisabled || isActive) && (style1 || style2 || style4)
              ? {
                  id: "checkboxPadding",
                  type: "padding-dev",
                  label: t("Padding"),
                  position: 50
                }
              : {},
            checkRadioDisabled && style3
              ? {
                  id: "checkboxCustomStylesPadding",
                  type: "padding-dev",
                  label: t("Padding"),
                  position: 50
                }
              : {},
            (checkRadioDisabled || isActive) && (style1 || style2 || style4)
              ? {
                  id: "checkboxBorder",
                  type: "corners-dev",
                  label: t("Corner"),
                  devices: "desktop",
                  prefix: "checkbox",
                  position: 65
                }
              : {},
            checkRadioDisabled && style3
              ? {
                  id: "checkboxCustomStylesBorder",
                  type: "corners-dev",
                  label: t("Corner"),
                  devices: "desktop",
                  prefix: "checkboxCustomStyles",
                  position: 65
                }
              : {},
            !checkRadioDisabled && !isActive && !isRange
              ? {
                  id: "optionsPadding",
                  type: "padding-dev",
                  label: t("Padding"),
                  position: 50
                }
              : {},
            !checkRadioDisabled && !isActive
              ? {
                  id: "optionsBorder",
                  type: "corners-dev",
                  label: t("Corner"),
                  devices: "desktop",
                  prefix: "options",
                  position: 65
                }
              : {}
          ]
        }
      ]
    }
  ];
}
