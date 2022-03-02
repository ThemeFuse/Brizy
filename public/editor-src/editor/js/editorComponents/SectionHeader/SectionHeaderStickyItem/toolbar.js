import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getOptionColorHexByPalette,
  getDynamicContentChoices
} from "visual/utils/options";
import {
  toolbarBoxShadow2,
  toolbarBoxShadowHexField2,
  toolbarElementSectionBoxShadow
} from "visual/utils/toolbar";
import { NORMAL, HOVER } from "visual/utils/stateMode";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export function getItems({ v, device, state, context }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const imageDynamicContentChoices = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.image
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        icon: "nc-background",
        title: t("Background")
      },
      position: 20,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Image"),
              options: [
                {
                  label: t("Image"),
                  id: "bg",
                  type: "imageUpload-dev",
                  states: [NORMAL, HOVER],
                  population: imageDynamicContentChoices
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
          }
        }
      },
      position: 30,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabOverlay",
              label: t("Overlay "),
              options: [
                {
                  id: "",
                  type: "backgroundColor-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                toolbarBoxShadow2({
                  v,
                  device,
                  state,
                  states: [NORMAL, HOVER],
                  choices: "inset",
                  onChangeType: [
                    "onChangeBoxShadowType2",
                    "onChangeBoxShadowTypeDependencies2"
                  ],
                  onChangeHex: [
                    "onChangeBoxShadowHexAndOpacity2",
                    "onChangeBoxShadowHexAndOpacityPalette2",
                    "onChangeBoxShadowHexAndOpacityDependencies2"
                  ],
                  onChangePalette: [
                    "onChangeBoxShadowPalette2",
                    "onChangeBoxShadowPaletteOpacity2",
                    "onChangeBoxShadowHexAndOpacityDependencies2"
                  ]
                }),
                {
                  type: "grid",
                  className: "brz-ed-grid__color-fileds",
                  columns: [
                    {
                      width: 65,
                      options: [
                        toolbarBoxShadowHexField2({
                          v,
                          device,
                          state,
                          states: [NORMAL, HOVER],
                          onChange: [
                            "onChangeBoxShadowHexAndOpacity2",
                            "onChangeBoxShadowHexAndOpacityPalette2",
                            "onChangeBoxShadowHexAndOpacityDependencies2"
                          ]
                        })
                      ]
                    },
                    {
                      width: 35,
                      options: [
                        toolbarElementSectionBoxShadow({
                          v,
                          device,
                          state,
                          states: [NORMAL, HOVER],
                          onChange: [
                            "onChangeBoxShadowFields2",
                            "onChangeBoxShadowFieldsDependencies2"
                          ]
                        })
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "containerTypeGroup",
          type: "group-dev",
          position: 10,
          devices: "desktop",
          options: [
            {
              id: "containerType",
              label: t("Width"),
              type: "select-dev",
              choices: [
                { title: t("Boxed"), value: "boxed" },
                { title: t("Full"), value: "fullWidth" }
              ]
            },
            {
              id: "containerSize",
              type: "slider-dev",
              disabled: v.containerType !== "boxed",
              config: {
                min: 35,
                max: 100,
                units: [{ title: "%", value: "%" }]
              }
            }
          ]
        },
        {
          id: "containerSize",
          type: "slider-dev",
          label: t("Width"),
          position: 10,
          devices: "responsive",
          config: {
            min: 35,
            max: 100,
            units: [{ title: "%", value: "%" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          devices: "desktop",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          position: 30
        }
      ]
    }
  ];
}
