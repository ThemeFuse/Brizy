import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { getAllMembershipChoices } from "visual/utils/membership";
import { getLanguagesChoices } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import * as Str from "visual/utils/reader/string";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { capitalize } from "visual/utils/string";
import { getInstanceParentId } from "visual/utils/toolbar";
import type { Props, Value } from "./type";
import { Toggle } from "visual/utils/options/utils/Type";
import { Cloud } from "visual/global/Config";

//@ts-expect-error: ??
export const getItems: GetItems<Value, Props> = ({ v, device, component }) => {
  const config = component.getGlobalConfig();
  const disabledSavedBlock =
    typeof config.api?.savedBlocks?.create !== "function";
  const disabledGlobalBlock =
    typeof config.api?.globalBlocks?.create !== "function";

  const globalBlockId = Str.read(component.props.meta.globalBlockId);
  const multilanguage: boolean = config.multilanguage === true;
  const membership: boolean = config.membership === true;

  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });
  const slider = dvv("slider");

  const deviceCapitalize = capitalize(device);

  const sliderDotsChoices = [
    { title: t("None"), icon: { name: "nc-none" }, value: "none" },
    {
      title: t("Circle"),
      icon: { name: "nc-circle-outline" },
      value: "circle"
    },
    {
      title: t("Diamond"),
      icon: { name: "nc-diamond-outline" },
      value: "diamond"
    },
    { title: t("Square"), icon: { name: "nc-square-outline" }, value: "square" }
  ];

  const sliderArrowsChoices = [
    { title: t("None"), icon: { name: "nc-none" }, value: "none" },
    { title: t("Thin"), icon: { name: "nc-right-arrow-thin" }, value: "thin" },
    {
      title: t("Heavy"),
      icon: { name: "nc-right-arrow-heavy" },
      value: "heavy"
    },
    { title: t("Tail"), icon: { name: "nc-right-arrow-tail" }, value: "tail" },
    {
      title: t("Round"),
      icon: { name: "nc-right-arrow-filled" },
      value: "filled"
    },
    {
      title: t("Outline"),
      icon: { name: "nc-right-arrow-outline" },
      value: "outline"
    }
  ];

  return [
    {
      id: `showOn${deviceCapitalize}`,
      type: "showOnDevice",
      devices: "responsive",
      position: 10,
      preserveId: true,
      choices: [
        {
          icon: "nc-eye-17",
          title: `${t("Disable on")} ${deviceCapitalize}`,
          value: Toggle.ON
        },
        {
          icon: "nc-eye-ban-18",
          title: `${t("Enable on")} ${deviceCapitalize}`,
          value: Toggle.OFF
        }
      ]
    },
    {
      id: "toolbarSlider",
      type: "popover",
      devices: "desktop",
      config: {
        icon: "nc-block-switch",
        title: t("Block")
      },
      position: 70,
      options: [
        {
          id: "sliders",
          type: "tabs",
          tabs: [
            {
              id: "sliderOption1",
              label: t("Block"),
              devices: "desktop",
              options: [
                {
                  id: "groupSettings",
                  type: "group",
                  disabled: disabledGlobalBlock,
                  options: [
                    {
                      id: "makeItGlobal",
                      label: t("Make it Global"),
                      type: "globalBlock",
                      config: {
                        _id: component.getId(),
                        parentId: getInstanceParentId(
                          component.props.instanceKey
                        ),
                        blockType: "normal"
                      }
                    },
                    {
                      id: "gbConditions",
                      disabled: !globalBlockId,
                      config: {
                        globalBlockId: globalBlockId as string
                      },
                      type: "gbCondition",
                      context: "block"
                    }
                  ]
                },
                {
                  id: "membershipGroup",
                  type: "group",
                  disabled: !membership,
                  options: [
                    {
                      id: "membership",
                      label: t("Membership"),
                      type: "switch"
                    },
                    {
                      id: "membershipRoles",
                      label: t("Show to"),
                      type: "multiSelect",
                      placeholder: t("Select"),
                      disabled: dvv("membership") === "off",
                      choices: getAllMembershipChoices(config as Cloud)
                    }
                  ]
                },
                {
                  id: "translationsGroup",
                  type: "group",
                  disabled: !multilanguage,
                  options: [
                    {
                      id: "translations",
                      label: t("Multi-Language"),
                      type: "switch"
                    },
                    {
                      id: "translationsLangs",
                      label: t("Show If Language"),
                      type: "multiSelect",
                      placeholder: t("Select"),
                      disabled: dvv("translations") === "off",
                      choices: getLanguagesChoices(config as Cloud)
                    }
                  ]
                },
                {
                  id: "slider",
                  label: t("Make it a Slider"),
                  type: "switch"
                }
              ]
            },
            ...(slider === "on"
              ? [
                  {
                    id: "sliderOption2",
                    label: t("Slider"),
                    options: [
                      {
                        id: "sliderAutoPlayGroup",
                        type: "group",
                        options: [
                          {
                            id: "sliderAutoPlay",
                            label: t("Autoplay"),
                            type: "switch"
                          },
                          {
                            id: "sliderAutoPlaySpeed",
                            label: t("Speed"),
                            type: "slider",
                            disabled: dvv("sliderAutoPlay") !== "on",
                            config: {
                              min: 1,
                              max: 6,
                              units: [{ title: "s", value: "s" }]
                            }
                          }
                        ]
                      },
                      {
                        id: "sliderAnimation",
                        label: t("Animation"),
                        type: "radioGroup",
                        disabled: slider === "off",
                        choices: [
                          {
                            icon: "nc-slider-horizontal",
                            value: "none"
                          },
                          {
                            icon: "nc-fade",
                            value: "fade"
                          }
                        ]
                      },
                      {
                        id: "sliderAnimationSpeed",
                        label: t("Speed"),
                        type: "slider",
                        disabled: slider === "off",
                        config: {
                          min: 0.1,
                          max: 10,
                          step: 0.1,
                          units: [{ title: "s", value: "s" }]
                        }
                      },
                      {
                        id: "sliderDots",
                        label: t("Dots"),
                        type: "select",
                        choices: sliderDotsChoices
                      },
                      {
                        id: "sliderArrows",
                        label: t("Arrows"),
                        type: "select",
                        choices: sliderArrowsChoices
                      }
                    ]
                  }
                ]
              : [])
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Color")
      },
      position: 90,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs:
            slider === "off"
              ? []
              : [
                  {
                    id: "dots",
                    label: t("Dots"),
                    options: [
                      {
                        id: "sliderDotsColor",
                        type: "colorPicker",
                        states: [NORMAL, HOVER],
                        disabled: slider === "off"
                      }
                    ]
                  },
                  {
                    id: "arrows",
                    label: t("Arrows"),
                    options: [
                      {
                        id: "sliderArrowsColor",
                        type: "colorPicker",
                        states: [NORMAL, HOVER],
                        disabled: slider === "off"
                      }
                    ]
                  }
                ]
        }
      ]
    },
    {
      id: "makeItSaved",
      type: "savedBlock",
      devices: "desktop",
      position: 90,
      disabled: disabledSavedBlock,
      config: {
        icon: "nc-save-section",
        blockType: "normal",
        title: t("Save"),
        tooltipContent: t("Saved"),
        blockId: component.getId()
      }
    },
    {
      id: "toolbarSettings",
      type: "popover",
      options: [
        {
          id: "toolbarContainerTypeAndHeight",
          type: "group",
          position: 100,
          options: [
            {
              id: "fullHeight",
              label: t("Height"),
              type: "select",
              choices: [
                { title: t("Auto"), value: "off" },
                { title: t("Custom"), value: "custom" },
                { title: t("Full Height"), value: "on" }
              ]
            },
            {
              id: "sectionHeight",
              type: "slider",
              disabled: dvv("fullHeight") !== "custom",
              config: {
                min: 20,
                max: dvv("sectionHeightSuffix") === "px" ? 500 : 100,
                units: [
                  { title: "px", value: "px" },
                  { title: "%", value: "vh" }
                ]
              }
            }
          ]
        },
        {
          id: "verticalAlign",
          label: t("Content"),
          type: "radioGroup",
          disabled: dvv("fullHeight") === "off",
          position: 110,
          choices: [
            { value: "top", icon: "nc-align-top" },
            { value: "center", icon: "nc-align-middle" },
            { value: "bottom", icon: "nc-align-bottom" }
          ]
        }
      ]
    }
  ];
};
