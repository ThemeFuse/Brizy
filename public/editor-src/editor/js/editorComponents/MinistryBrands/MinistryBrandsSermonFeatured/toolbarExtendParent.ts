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
  component,
  context,
  state
}) => {
  const _config = Config.getAll();
  const ekklesia = _config.modules?.ekklesia;
  const { getSourceChoices } = _config.api?.sourceTypes ?? {};

  const recentSermons = getOption(ekklesia?.recentSermons);
  const group = getOption(ekklesia?.groups);
  const series = getOption(ekklesia?.series);
  const categories = getOption(ekklesia?.terms?.sermon);

  const dvv = (key: string) => defaultValueValue({ v, key, device });

  return [
    {
      id: "toolbarSermonFeatured",
      type: "popover-dev",
      config: {
        icon: "t2-sermon-featured",
        title: t("Sermon Featured")
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
                  devices: "desktop",
                  label: t("Category"),
                  type: "select-dev",
                  choices: categories
                },
                {
                  id: "group",
                  devices: "desktop",
                  label: t("Group"),
                  type: "select-dev",
                  choices: group
                },
                {
                  id: "series",
                  devices: "desktop",
                  label: t("Series"),
                  type: "select-dev",
                  choices: series
                }
              ]
            },

            {
              id: "tabSermonFeatured",
              label: t("Display"),
              options: [
                {
                  id: "showImage",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Image"),
                  helper: {
                    content: t(
                      "Only select if 'Display Video' is not selected."
                    )
                  }
                },
                {
                  id: "showVideo",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Video"),
                  helper: {
                    content: t(
                      "If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Display Images'."
                    )
                  }
                },
                {
                  id: "showAudio",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Audio")
                },
                {
                  id: "showTitle",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Title")
                },
                {
                  id: "showDate",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Date")
                },
                {
                  id: "showCategory",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Category")
                },
                {
                  id: "showGroup",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Group")
                },
                {
                  id: "showSeries",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Series")
                },
                {
                  id: "showPreacher",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Preacher")
                },
                {
                  id: "showPassage",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Passage")
                },
                {
                  id: "showMetaHeadings",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Meta Headings")
                },
                {
                  id: "showContent",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Content")
                },
                {
                  id: "sermonLatest",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Sermon Latest"),
                  helper: {
                    content: t(
                      "This option automatically shows the latest sermon and overrides the 'Recent Sermons' and 'Sermon Slug' options."
                    )
                  }
                },
                {
                  id: "features",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Featured"),
                  helper: {
                    content: t(
                      "This option only applies to 'Always Display Latest' and if this is selected the Non featured Only option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("No featured"),
                  helper: {
                    content: t(
                      "This option only applies to 'Always Display Latest' and if this is selected the Featured Only option does not apply."
                    )
                  }
                },
                {
                  id: "showMediaLinks",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Media Links")
                },
                {
                  id: "showPreview",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Preview")
                }
              ]
            },
            {
              id: "tabSermonFeaturedText",
              label: t("Text"),
              options: [
                {
                  id: "sermonRecentList",
                  label: t("Recent Sermons"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: recentSermons,
                  helper: {
                    content: t(
                      "Select a recent sermon. Use only if you are not using 'Sermon Slug' below and 'Display Latest' is set to 'No'."
                    )
                  }
                },
                {
                  id: "sermonSlug",
                  type: "inputText-dev",
                  devices: "desktop",
                  label: t("Slug"),
                  placeholder: t("Sermon Slug..."),
                  helper: {
                    content: t(
                      "Slug of sermon (my-sermon-name). Use only if you are not selecting from the 'Recent Sermons' above and 'Always Latest' is set to 'No'."
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
                  id: "detailPageButtonText",
                  type: "inputText-dev",
                  label: t("Button"),
                  devices: "desktop",
                  placeholder: t("Button Text..."),
                  disabled: !dvv("detailPage")
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
