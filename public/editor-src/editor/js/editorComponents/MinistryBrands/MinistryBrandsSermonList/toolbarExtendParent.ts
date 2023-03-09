import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { getOption } from "../utils/helpers";
import { Props, Value } from "./types";

// @ts-expect-error advancedSettings is old option
export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  state,
  component,
  context
}) => {
  const _config = Config.getAll();
  const ekklesia = _config.modules?.ekklesia;
  const { getSourceChoices } = _config.api?.sourceTypes ?? {};

  const group = getOption(ekklesia?.groups);
  const series = getOption(ekklesia?.series);
  const categories = getOption(ekklesia?.terms?.sermon);

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  return [
    {
      id: "toolbarSermonList",
      type: "popover-dev",
      config: {
        icon: "t2-sermon-list",
        title: t("Sermon List")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "category",
                  label: t("Category"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: categories
                },
                {
                  id: "group",
                  label: t("Group"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: group
                },
                {
                  id: "series",
                  label: t("Series"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: series
                }
              ]
            },
            {
              id: "tabColumns",
              label: t("Columns"),
              options: [
                {
                  id: "itemsNumber",
                  label: t("Items"),
                  devices: "desktop",
                  type: "number-dev",
                  config: {
                    min: 1,
                    max: 20,
                    spinner: true
                  }
                },
                {
                  id: "columnNumber",
                  label: t("Columns"),
                  type: "number-dev",
                  config: {
                    min: 1,
                    max: 6,
                    spinner: true
                  }
                }
              ]
            },
            {
              id: "tabSermonList",
              label: t("Display"),
              options: [
                {
                  id: "showTitle",
                  label: t("Title"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showVideo",
                  label: t("Video"),
                  type: "switch-dev",
                  devices: "desktop",
                  helper: {
                    content: t(
                      "If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Display Image'."
                    )
                  }
                },
                {
                  id: "showImages",
                  label: t("Images"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showAudio",
                  label: t("Audio"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showMeta",
                  label: t("Meta"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showDate",
                  label: t("Date"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showCategory",
                  label: t("Category"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showGroup",
                  label: t("Group"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showPreacher",
                  label: t("Preacher"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showPassages",
                  label: t("Passages"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showSeries",
                  label: t("Series"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showMedia",
                  label: t("Media"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showPreview",
                  label: t("Preview"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "showPagination",
                  label: t("Pagination"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "features",
                  label: t("Featured"),
                  type: "switch-dev",
                  devices: "desktop",
                  helper: {
                    content: t(
                      "If this is selected the Non featured Only option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  label: t("No featured"),
                  type: "switch-dev",
                  devices: "desktop",
                  helper: {
                    content: t(
                      "If this is selected the Featured Only option does not apply."
                    )
                  }
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
                      "URL of sermon detail page. If used will add a link to the heading to take the user to the sermon detail page. Requires the 'Sermon Detail' widget to be placed on a page and that page url/slug placed in this field ."
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
                  devices: "desktop",
                  type: "inputText-dev",
                  placeholder: t("Button text..."),
                  label: t("Button"),
                  disabled: !dvv("detailUrl"),
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
      component,
      context
    }),
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
          id: "itemSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
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
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      disabled: true
    },
    {
      id: "itemHorizontalAlign",
      type: "toggle-dev",
      position: 80,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    }
  ];
};
