import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";
import {
  toolbarBorder2,
  toolbarBorderColorHexField2,
  toolbarBorderWidthOneField2,
  toolbarSizeWidthWidthPercent,
  toolbarDisabledAdvancedSettings
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  return [
    {
      id: defaultValueKey({ key: "toolbarColor", device }),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      devices: "desktop",
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
        }
      },
      options: [
        toolbarBorder2({
          v,
          device,
          state: "normal",
          selectChoices: [
            {
              value: "solid",
              icon: "nc-solid"
            },
            {
              value: "dashed",
              icon: "nc-dashed"
            },
            {
              value: "dotted",
              icon: "nc-dotted"
            }
          ],
          onChangeStyle: [
            "onChangeBorderStyle2",
            "onChangeElementBorderStyleDependencies2"
          ],
          onChangeHex: [
            "onChangeBorderColorHexAndOpacity2",
            "onChangeBorderColorHexAndOpacityPalette2"
          ],
          onChangePalette: [
            "onChangeBorderColorPalette2",
            "onChangeBorderColorPaletteOpacity2"
          ]
        }),
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                toolbarBorderColorHexField2({
                  v,
                  device,
                  onChange: [
                    "onChangeBorderColorHexAndOpacity2",
                    "onChangeBorderColorHexAndOpacityPalette2"
                  ]
                })
              ]
            },
            {
              width: 62,
              options: [
                toolbarBorderWidthOneField2({
                  v,
                  device,
                  state: "normal",
                  onChange: ["onChangeBorderWidthGrouped2"]
                })
              ]
            }
          ]
        }
      ]
    },
    toolbarDisabledAdvancedSettings({ device }),
    {
      id: defaultValueKey({ key: "toolbarSettings", device }),
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({ v, device }),
        {
          id: defaultValueKey({ key: "advancedSettings", device }),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              devices: "desktop",
              align: "start",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Styling"),
                  tabIcon: "nc-styling",
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: []
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
