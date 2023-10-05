import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";
import { t } from "visual/utils/i18n";
import { getAllMembershipChoices } from "visual/utils/membership";
import { getLanguagesChoices } from "visual/utils/multilanguages";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { toolbarShowOnResponsive } from "visual/utils/toolbar";
import { getInstanceParentId } from "visual/utils/toolbar";

export function getItems({ v, device, component }) {
  const config = Config.getAll();
  const disabledSavedBlock =
    typeof config.api?.savedBlocks?.create !== "function";

  const isMultiLanguageDisabled =
    config.elements?.section?.multilanguage === false;
  const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });
  const slider = dvv("slider");

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
                    {
                      id: "makeItGlobal",
                      label: t("Make it Global"),
                      type: "globalBlock-dev",
                      disabled: isCloud(config) && isShopify(config),
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
                      disabled: !component.props.meta.globalBlockId,
                      value: component.props.meta.globalBlockId,
                      type: "gbConditions",
                      context: "block"
                    }
                  ]
                },
                {
                  id: "membershipGroup",
                  type: "group-dev",
                  disabled: isCloud(config) && isShopify(config),
                  options: [
                    {
                      id: "membership",
                      label: t("Membership"),
                      type: "switch-dev"
                    },
                    {
                      id: "membershipRoles",
                      label: t("Show to"),
                      type: "multiSelect-dev",
                      placeholder: "Select",
                      disabled: dvv("membership") === "off",
                      choices: getAllMembershipChoices(config)
                    }
                  ]
                },
                {
                  id: "translationsGroup",
                  type: "group-dev",
                  disabled: isWp(config),
                  options: [
                    {
                      id: "translations",
                      label: t("Multi-Language"),
                      type: "switch-dev",
                      disabled: isMultiLanguageDisabled
                    },
                    {
                      id: "translationsLangs",
                      label: t("Show If Language"),
                      type: "multiSelect-dev",
                      placeholder: "Select",
                      disabled: dvv("translations") === "off",
                      choices: getLanguagesChoices(config)
                    }
                  ]
                },
                {
                  id: "slider",
                  label: t("Make it a Slider"),
                  type: "switch-dev"
                }
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
                          label: t("Autoplay"),
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
    {
      id: "makeItSaved",
      type: "savedBlock-dev",
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
      type: "popover-dev",
      options: [
        {
          id: "toolbarContainerTypeAndHeight",
          type: "group-dev",
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
          type: "radioGroup-dev",
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
