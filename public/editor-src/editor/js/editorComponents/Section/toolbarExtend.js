import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import {
  toolbarShowOnResponsive,
  toolbarElementSectionSaved,
  toolbarElementSectionGlobal
} from "visual/utils/toolbar";
import { defaultValueValue } from "visual/utils/onChange";
import { IS_WP } from "visual/utils/models";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device, component }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const slider = dvv("slider");

  const sliderDotsChoices = [
    { title: t("None"), icon: "nc-none", value: "none" },
    { title: t("Circle"), icon: "nc-circle-outline", value: "circle" },
    { title: t("Diamond"), icon: "nc-diamond-outline", value: "diamond" },
    { title: t("Square"), icon: "nc-square-outline", value: "square" }
  ];

  const sliderArrowsChoices = [
    { title: t("None"), icon: "nc-none", value: "none" },
    { title: t("Thin"), icon: "nc-right-arrow-thin", value: "thin" },
    { title: t("Heavy"), icon: "nc-right-arrow-heavy", value: "heavy" },
    { title: t("Tail"), icon: "nc-right-arrow-tail", value: "tail" },
    { title: t("Round"), icon: "nc-right-arrow-filled", value: "filled" },
    { title: t("Outline"), icon: "nc-right-arrow-outline", value: "outline" }
  ];

  const membershipRoles = Config.get("wp")?.availableRoles || [];

  return [
    toolbarShowOnResponsive({
      v,
      device,
      devices: "responsive",
      closeTooltip: true
    }),
    {
      id: "toolbarSlider",
      type: "popover-dev",
      devices: "desktop",
      config: {
        icon: "nc-block-switch",
        title: t("Block")
      },
      position: 70,
      options: [
        {
          id: "sliders",
          type: "tabs-dev",
          tabs: [
            {
              id: "sliderOption1",
              label: t("Block"),
              devices: "desktop",
              options: [
                {
                  id: "groupSettings",
                  type: "group-dev",
                  options: [
                    toolbarElementSectionGlobal({
                      device,
                      devices: "all",
                      component
                    })
                  ]
                },
                {
                  id: "membership",
                  label: t("Membership"),
                  type: "switch-dev",
                  disabled: !IS_WP
                },
                {
                  id: "membershipRoles",
                  label: t("Show to"),
                  type: "multiSelect-dev",
                  placeholder: "Select",
                  disabled: v.membership === "off" || !IS_WP,
                  choices: [
                    {
                      title: "Not logged",
                      value: "not_logged"
                    },
                    ...membershipRoles.map(({ role, name }) => ({
                      title: name,
                      value: role
                    }))
                  ]
                },
                {
                  id: "slider",
                  label: t("Make it a Slider"),
                  type: "switch-dev"
                }
                // {
                //   id: "sliderAnimation",
                //   label: t("Entrance Animation"),
                //   type: "radioGroup",
                //   disabled: slider === "off",
                //   choices: [
                //     { icon: "nc-slider-horizontal", value: "none" },
                //     { icon: "nc-slider-vertical", value: "vertical" },
                //     { icon: "nc-fade", value: "fade" }
                //   ],
                //   value: v.sliderAnimation,
                //   onChange: sliderAnimation => {
                //     hideToolbar();
                //     return {
                //       sliderAnimation
                //     };
                //   }
                // }
              ]
            },
            slider === "on"
              ? {
                  id: "sliderOption2",
                  label: t("Slider"),
                  options: [
                    {
                      id: "sliderAutoPlayGroup",
                      type: "group-dev",
                      options: [
                        {
                          id: "sliderAutoPlay",
                          label: t("Auto Play"),
                          type: "switch-dev"
                        },
                        {
                          id: "sliderAutoPlaySpeed",
                          label: t("Speed"),
                          type: "slider-dev",
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
                      id: "sliderDots",
                      label: t("Dots"),
                      type: "select-dev",
                      choices: sliderDotsChoices
                    },
                    {
                      id: "sliderArrows",
                      label: t("Arrows"),
                      type: "select-dev",
                      choices: sliderArrowsChoices
                    }
                  ]
                }
              : {}
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto"
      },
      position: 90,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
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
                        type: "colorPicker-dev",
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
                        type: "colorPicker-dev",
                        states: [NORMAL, HOVER],
                        disabled: slider === "off"
                      }
                    ]
                  }
                ]
        }
      ]
    },
    toolbarElementSectionSaved({
      device,
      component,
      devices: "desktop",
      state: "normal",
      blockType: "normal"
    }),
    {
      id: "toolbarSettings",
      type: "popover-dev",
      options: [
        {
          id: "toolbarContainerTypeAndHeight",
          type: "group-dev",
          devices: "desktop",
          position: 100,
          options: [
            {
              id: "fullHeight",
              label: t("Height"),
              type: "select-dev",
              choices: [
                { title: t("Auto"), value: "off" },
                { title: t("Custom"), value: "custom" },
                { title: t("Full Height"), value: "on" }
              ]
            },
            {
              id: "sectionHeight",
              type: "slider-dev",
              disabled: v.fullHeight !== "custom",
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
          type: "radioGroup-dev",
          devices: "desktop",
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
}
