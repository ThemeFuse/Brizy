import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const { v, device, component } = data;
  const config = component.getGlobalConfig();

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const sermonLatestActive = dvv("sermonLatest") === "on";

  return [
    {
      id: "toolbarSermonFeatured",
      type: "popover",
      config: {
        icon: "t2-sermon-featured",
        title: t("Sermon Featured")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          config: {
            saveTab: true
          },
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "sermonLatest",
                  type: "switch",
                  devices: "desktop",
                  label: t("Show Latest"),
                  helper: {
                    content: t(
                      "This option automatically shows the latest sermon and overrides the 'Recent Sermons' and 'Sermon Slug' options."
                    )
                  }
                },
                {
                  id: "category",
                  devices: "desktop",
                  label: t("Category"),
                  type: "select",
                  disabled: !sermonLatestActive,
                  choices: getEkklesiaChoiches(config, {
                    key: "sermon"
                  }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "group",
                  devices: "desktop",
                  label: t("Group"),
                  type: "select",
                  disabled: !sermonLatestActive,
                  choices: getEkklesiaChoiches(config, {
                    key: "groups"
                  }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "series",
                  devices: "desktop",
                  label: t("Series"),
                  type: "select",
                  disabled: !sermonLatestActive,
                  choices: getEkklesiaChoiches(config, {
                    key: "series"
                  }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "sermonRecentList",
                  label: t("Recent Sermons"),
                  type: "select",
                  devices: "desktop",
                  disabled: sermonLatestActive,
                  choices: getEkklesiaChoiches(config, {
                    key: "recentSermons"
                  }),
                  helper: {
                    content: t(
                      "Select a recent sermon. Use only if you are not using 'Sermon Slug' below and 'Show Latest' is set to 'Off'."
                    )
                  }
                },
                {
                  id: "sermonSlug",
                  type: "inputText",
                  devices: "desktop",
                  disabled: sermonLatestActive,
                  label: t("Slug"),
                  placeholder: t("Sermon Slug..."),
                  config: {
                    size: "medium"
                  },
                  helper: {
                    content: t(
                      "Slug of sermon (my-sermon-name). Use only if you are not selecting from the 'Recent Sermons' above and 'Show Latest' is set to 'Off'."
                    )
                  }
                },
                {
                  id: "features",
                  type: "switch",
                  devices: "desktop",
                  label: t("Featured"),
                  disabled: !sermonLatestActive || dvv("nonfeatures") === "on",
                  helper: {
                    content: t(
                      "This option only applies to 'Show Latest' and if this is selected the 'Non featured' option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  type: "switch",
                  devices: "desktop",
                  label: t("Non Featured"),
                  disabled: !sermonLatestActive || dvv("features") === "on",
                  helper: {
                    content: t(
                      "This option only applies to 'Show Latest' and if this is selected the 'Featured' option does not apply."
                    )
                  }
                }
              ]
            },
            {
              id: "tabSermonDisplay",
              label: t("Display"),
              options: [
                {
                  id: "showMetaIcons",
                  label: t("Meta Icons"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "showImage",
                  type: "switch",
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
                  type: "switch",
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
                  type: "switch",
                  devices: "desktop",
                  label: t("Audio")
                },
                {
                  id: "showTitle",
                  type: "switch",
                  devices: "desktop",
                  label: t("Title")
                },
                {
                  id: "showDate",
                  type: "switch",
                  devices: "desktop",
                  label: t("Date")
                },
                {
                  id: "showCategory",
                  type: "switch",
                  devices: "desktop",
                  label: t("Category")
                },
                {
                  id: "showGroup",
                  type: "switch",
                  devices: "desktop",
                  label: t("Group")
                },
                {
                  id: "showSeries",
                  type: "switch",
                  devices: "desktop",
                  label: t("Series")
                },
                {
                  id: "showPreacher",
                  type: "switch",
                  devices: "desktop",
                  label: t("Preacher")
                },
                {
                  id: "showPassage",
                  type: "switch",
                  devices: "desktop",
                  label: t("Passage")
                },
                {
                  id: "showMetaHeadings",
                  type: "switch",
                  devices: "desktop",
                  label: t("Meta Headings")
                },
                {
                  id: "showContent",
                  type: "switch",
                  devices: "desktop",
                  label: t("Content")
                },
                {
                  id: "showMediaLinks",
                  type: "switch",
                  devices: "desktop",
                  label: t("Media Links")
                },
                {
                  id: "showPreview",
                  type: "switch",
                  devices: "desktop",
                  label: t("Preview")
                }
              ]
            },
            {
              id: "page",
              label: t("Page"),
              options: [
                {
                  id: "detailPage",
                  type: "internalLink",
                  label: t("Item"),
                  devices: "desktop",
                  config: {
                    helper: t(
                      "URL of sermon detail page. If used will add a link to the heading to take the user to the sermon detail page. Requires the 'Sermon Detail' widget to be placed on a page and that page url/slug placed in this field ."
                    )
                  }
                },
                {
                  id: "detailPageButtonText",
                  type: "inputText",
                  label: t("Button"),
                  devices: "desktop",
                  placeholder: t("Button Text..."),
                  disabled: !dvv("detailPage"),
                  config: {
                    size: "medium"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    ...toolbarParentColors<Value, Props>(data),
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "itemSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
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
                  type: "sidebarTabsButton",
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
      type: "toggle",
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
      type: "toggle",
      position: 80,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    }
  ];
};
