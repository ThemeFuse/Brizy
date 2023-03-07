import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { getOption } from "../utils/helpers";
import { Props, Value } from "./types";

// @ts-expect-error "advancedSettings" is old options
export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  state,
  context,
  component
}) => {
  const _config = Config.getAll();
  const ekklesia = _config.modules?.ekklesia;
  const { getSourceChoices } = _config.api?.sourceTypes ?? {};

  const categories = getOption(ekklesia?.terms?.smallgroup);
  const group = getOption(ekklesia?.groups);

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  return [
    {
      id: "toolbarGroupSlider",
      type: "popover-dev",
      config: {
        icon: "t2-group-slider",
        title: t("Group Slider")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          devices: "desktop",
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "category",
                  label: t("Category"),
                  type: "select-dev",
                  choices: categories
                },
                {
                  id: "group",
                  label: t("Group"),
                  type: "select-dev",
                  choices: group
                },
                {
                  id: "howmany",
                  label: t("Items"),
                  type: "number-dev",
                  config: {
                    min: 1,
                    max: 24,
                    spinner: true
                  }
                },
                {
                  id: "slidesToShow",
                  label: t("Columns"),
                  type: "number-dev",
                  config: {
                    min: 1,
                    max: 4,
                    spinner: true
                  }
                }
              ]
            },
            {
              id: "tabDisplay",
              label: t("Display"),
              options: [
                {
                  id: "showArrows",
                  type: "switch-dev",
                  label: t("Arrows")
                },
                {
                  id: "showPagination",
                  type: "switch-dev",
                  label: t("Pagination")
                },
                {
                  id: "showImages",
                  type: "switch-dev",
                  label: t("Images")
                },
                {
                  id: "showMeetingDay",
                  type: "switch-dev",
                  label: t("Meeting day")
                },
                {
                  id: "showMeetingTimes",
                  type: "switch-dev",
                  label: t("Meeting times")
                },
                {
                  id: "showCategory",
                  type: "switch-dev",
                  label: t("Category")
                },
                {
                  id: "showGroup",
                  type: "switch-dev",
                  label: t("Group")
                },
                {
                  id: "showStatus",
                  type: "switch-dev",
                  label: t("Status")
                },
                {
                  id: "showChildcare",
                  type: "switch-dev",
                  label: t("Childcare")
                },
                {
                  id: "showResourceLink",
                  type: "switch-dev",
                  label: t("Resource link")
                },
                {
                  id: "showPreview",
                  type: "switch-dev",
                  label: t("Preview")
                }
              ]
            },
            {
              id: "page",
              label: t("Page"),
              options: [
                {
                  id: "source",
                  type: "select-dev",
                  label: t("Type"),
                  devices: "desktop",
                  choices: getSourceChoices?.() ?? [],
                  config: {
                    size: "large"
                  },
                  helper: {
                    content: t(
                      'URL of group detail page. If used will add a link to the heading to take the user to the group detail page. Requires the "Group Detail" widget to be placed on a page and that page url/slug placed in this field.'
                    )
                  }
                },
                {
                  id: "detailPage",
                  type: "internalLink-dev",
                  label: t("Item"),
                  devices: "desktop",
                  disabled: !v.source,
                  config: {
                    postType: v.source
                  }
                },
                {
                  id: "detailPageButton",
                  type: "inputText-dev",
                  label: t("Button text"),
                  disabled: !dvv("detailPage"),
                  placeholder: t("Button text..."),
                  helper: {
                    content: t(
                      "Button will display if text is entered and a detail page selected."
                    )
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    ...toolbarParentColors<Value, Props>({
      v,
      device,
      state,
      context,
      component
    }),
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "itemsHorizontalAlign",
      type: "toggle-dev",
      position: 80,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" },
        { icon: "nc-text-align-justify", title: t("Align"), value: "justify" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 90,
      options: [
        {
          id: "itemsBetween",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid-dev",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "col-2",
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    }
  ];
};
