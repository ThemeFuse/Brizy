import { ChoicesSync } from "visual/component/Options/types/dev/MultiSelect2/types";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getTaxonomies } from "visual/utils/options";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, component }) => {
  const dvv = (key: string) =>
    defaultValueValue({ key, v, device, state: "normal" });

  const sliderArrowsColor = getColor(
    dvv("sliderArrowsColorPalette"),
    dvv("sliderArrowsColorHex"),
    dvv("sliderArrowsColorOpacity")
  );

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

  const getCategories = () => {
    const config = component.getGlobalConfig();
    const taxonomies = getTaxonomies(config.taxonomies);

    return taxonomies.flatMap((category) => category.optgroup) as ChoicesSync;
  };

  //@ts-expect-error review here when ConfigCommon is ready
  const wordpress = !!component.getGlobalConfig().wp;

  return [
    {
      id: "toolbarCarousel",
      type: "popover",
      config: {
        icon: "nc-carousel",
        title: t("Carousel")
      },
      position: 70,
      options: [
        {
          id: "toolbarCarouselTabs",
          type: "tabs",
          tabs: [
            {
              id: "carousel",
              label: t("Carousel"),
              options: [
                {
                  id: "groupSettings",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "sliderAutoPlay",
                      label: t("Autoplay"),
                      type: "switch"
                    },
                    {
                      id: "sliderAutoPlaySpeed",
                      label: t("Stop Time"),
                      type: "slider",
                      disabled: dvv("sliderAutoPlay") !== "on",
                      config: {
                        min: 0,
                        max: 6,
                        units: [{ value: "s", title: "s" }]
                      }
                    }
                  ]
                },
                {
                  id: "transitionSpeed",
                  label: t("Speed"),
                  type: "slider",
                  config: {
                    min: 1,
                    max: 40,
                    step: 0.1,
                    units: [{ value: "s", title: "s" }]
                  }
                },
                {
                  id: "slidesToShow",
                  label: t("Columns"),
                  type: "slider",
                  config: {
                    min: 1,
                    max: device === "mobile" ? 3 : 6
                  }
                },
                {
                  id: "sliderAnimation",
                  label: t("Animation"),
                  type: "radioGroup",
                  disabled: dvv("slidesToShow") > 1,
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
                  id: "spacing",
                  label: t("Spacing"),
                  type: "slider",
                  config: {
                    min: 1,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "sliderArrowsSpacing",
                  label: t("Arrows Spacing"),
                  type: "slider",
                  disabled: dvv("sliderArrows") === "none",
                  devices: "responsive",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: "navigation",
              label: t("Navigation"),
              options: [
                {
                  id: "groupSettings",
                  type: "group",
                  devices: "desktop",
                  options: [
                    {
                      id: "sliderArrows",
                      label: t("Arrows"),
                      type: "select",
                      choices: sliderArrowsChoices
                    },
                    {
                      id: "sliderArrowsSpacing",
                      label: t("Spacing"),
                      type: "slider",
                      disabled: dvv("sliderArrows") === "none",
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "sliderDots",
                  label: t("Dots"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("None"),
                      icon: { name: "nc-none" },
                      value: "none"
                    },
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
                    {
                      title: t("Square"),
                      icon: { name: "nc-square-outline" },
                      value: "square"
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
      id: "dynamicToolbarCarousel",
      type: "popover",
      config: {
        icon: "nc-dynamic",
        title: t("Dynamic Content")
      },
      devices: "desktop",
      disabled: !wordpress,
      position: 80,
      options: [
        {
          id: "dynamic",
          label: t("Dynamic Content"),
          type: "switch",
          devices: "desktop"
        },

        {
          id: "taxonomy",
          label: t("Categories"),
          disabled: dvv("dynamic") === "off",
          devices: "desktop",
          type: "select",
          choices: getCategories(),
          dependencies: ({ taxonomy }: { taxonomy: string }) => {
            const [, taxonomyId] = taxonomy.split("|");
            return {
              taxonomy,
              taxonomyId
            };
          }
        },
        {
          id: "orderBy",
          label: t("Filter By"),
          devices: "desktop",
          disabled: dvv("dynamic") === "off",
          type: "select",
          choices: [
            { title: t("ID"), value: "ID" },
            { title: t("Title"), value: "title" },
            { title: t("Date"), value: "date" },
            { title: t("Random"), value: "rand" },
            { title: t("Comment Count"), value: "comment_count" }
          ]
        },
        {
          id: "order",
          label: t("Order"),
          type: "radioGroup",
          devices: "desktop",
          disabled: dvv("dynamic") === "off",
          choices: [
            { value: "ASC", icon: "nc-up" },
            { value: "DESC", icon: "nc-down" }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: sliderArrowsColor
          }
        }
      },
      position: 90,
      devices: "desktop",
      options: [
        {
          id: "colorTabs",
          type: "tabs",
          config: {
            showSingle: true
          },
          tabs: [
            {
              id: "arrows",
              label: t("Arrows"),
              options: [
                {
                  id: "sliderArrowsColor",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "dots",
              label: t("Dots"),
              options: [
                {
                  id: "sliderDotsColor",
                  type: "colorPicker",
                  disabled: dvv("slider") === "off"
                }
              ]
            }
          ]
        }
      ]
    },
    { id: "horizontalAlign", type: "toggle", disabled: true, choices: [] },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      title: t("Settings"),
      devices: "desktop"
    }
  ];
};
