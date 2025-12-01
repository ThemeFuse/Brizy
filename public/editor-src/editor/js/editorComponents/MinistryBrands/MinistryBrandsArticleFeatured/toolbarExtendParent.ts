import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (props) => {
  const { v, device, component } = props;

  const config = component.getGlobalConfig();

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const showLatestArticles = dvv("showLatestArticles") === "on";
  return [
    {
      id: "toolbarArticlesFeatured",
      type: "popover",
      devices: "desktop",
      config: {
        icon: "t2-article-featured",
        title: t("Article Featured")
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
                  id: "showLatestArticles",
                  type: "switch",
                  label: t("Latest"),
                  helper: {
                    content: t(
                      "This option automatically shows the latest article and overrides the 'Recent Articles' and 'Article Slug' options."
                    )
                  }
                },
                {
                  id: "category",
                  label: t("Category"),
                  type: "select",
                  disabled: !showLatestArticles,
                  choices: getEkklesiaChoiches(config, {
                    key: "articleCategories"
                  }),
                  helper: {
                    content: t("This option only applies to 'Latest'.")
                  }
                },
                {
                  id: "group",
                  label: t("Group"),
                  type: "select",
                  disabled: !showLatestArticles,
                  choices: getEkklesiaChoiches(config, {
                    key: "groups"
                  }),
                  helper: {
                    content: t("This option only applies to 'Latest'.")
                  }
                },
                {
                  id: "series",
                  label: t("Series"),
                  type: "select",
                  disabled: !showLatestArticles,
                  choices: getEkklesiaChoiches(config, {
                    key: "articleSeries"
                  }),
                  helper: {
                    content: t("This option only applies to 'Latest'.")
                  }
                },
                {
                  id: "recentArticles",
                  label: t("Recent Articles"),
                  type: "select",
                  disabled: showLatestArticles || dvv("articleSlug") !== "",
                  choices: getEkklesiaChoiches(config, {
                    key: "articleRecent"
                  }),
                  helper: {
                    content: t(
                      'Select a recent article. Use only if you are not using "Article Slug" below and "Latest" is set to "Off".'
                    )
                  }
                },
                {
                  id: "features",
                  type: "switch",
                  label: t("Featured"),
                  disabled: !showLatestArticles || dvv("nonfeatures") === "on",
                  helper: {
                    content: t(
                      "This option only applies to 'Latest' and if this is selected the 'No featured' option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  type: "switch",
                  label: t("Non Featured"),
                  disabled: !showLatestArticles || dvv("features") === "on",
                  helper: {
                    content: t(
                      "This option only applies to 'Latest' and if this is selected the 'Featured' option does not apply."
                    )
                  }
                },
                {
                  id: "articleSlug",
                  type: "inputText",
                  placeholder: t("Slug..."),
                  disabled: showLatestArticles,
                  label: t("Slug"),
                  config: {
                    size: "medium"
                  },
                  helper: {
                    content: t(
                      'Slug of article (my-article-name). Use only if you are not selecting from the "Recent Articles" above and "Latest" is set to "Off".'
                    )
                  }
                }
              ]
            },
            {
              id: "tabArticleFeatured",
              label: t("Display"),
              options: [
                {
                  id: "showImage",
                  type: "switch",
                  label: t("Image"),
                  helper: {
                    content: t("Only select if Video' is not selected.")
                  }
                },
                {
                  id: "showVideo",
                  type: "switch",
                  label: t("Video"),
                  helper: {
                    content: t(
                      "If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Image'."
                    )
                  }
                },
                {
                  id: "showAudio",
                  type: "switch",
                  label: t("Audio")
                },
                {
                  id: "showMediaLinks",
                  type: "switch",
                  label: t("Media Links")
                },
                {
                  id: "showTitle",
                  type: "switch",
                  label: t("Title")
                },
                {
                  id: "showDate",
                  type: "switch",
                  label: t("Date")
                },
                {
                  id: "showCategory",
                  type: "switch",
                  label: t("Category")
                },
                {
                  id: "showGroup",
                  type: "switch",
                  label: t("Group")
                },
                {
                  id: "showSeries",
                  type: "switch",
                  label: t("Series")
                },
                {
                  id: "showAuthor",
                  type: "switch",
                  label: t("Author")
                },
                {
                  id: "showMetaHeadings",
                  type: "switch",
                  label: t("Meta Headings")
                },
                {
                  id: "showMetaIcons",
                  type: "switch",
                  label: t("Meta Icons")
                },
                {
                  id: "showPreview",
                  type: "switch",
                  label: t("Preview")
                },
                {
                  id: "showContent",
                  type: "switch",
                  label: t("Content")
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
                  config: {
                    helper: t(
                      'URL of article detail page. If used a link to the heading and an image will be added to take the user to the article detail page. Requires the "Article Detail" widget to be placed on a page and that page url/slug placed in this field .'
                    )
                  }
                },
                {
                  id: "detailPageButtonText",
                  type: "inputText",
                  placeholder: t("Button Text..."),
                  label: t("Button"),
                  disabled: !dvv("detailPage"),
                  config: {
                    size: "medium"
                  },
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
    ...toolbarParentColors<Value, Props>(props),
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
