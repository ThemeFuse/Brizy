import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { toolbarParentColors } from "visual/editorComponents/MinistryBrands/toolbarParent";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (props) => {
  const config = props.component.getGlobalConfig();

  return [
    {
      id: "toolbarArticleDetail",
      type: "popover",
      config: {
        icon: "t2-article-detail",
        title: t("Article Detail")
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
                  id: "recentArticles",
                  devices: "desktop",
                  label: t("Recent Articles"),
                  type: "select",
                  choices: getEkklesiaChoiches(config, {
                    key: "articleRecent"
                  }),
                  helper: {
                    content: t(
                      "Select a recent article as an example to style/setup. Since this is the article detail landing page this article will be replaced with the linked article."
                    )
                  }
                }
              ]
            },
            {
              id: "tabArticleDetailButtons",
              label: t("Buttons"),
              options: [
                {
                  id: "showMediaLinksVideo",
                  type: "switch",
                  devices: "desktop",
                  label: t("Video")
                },
                {
                  id: "showMediaLinksAudio",
                  type: "switch",
                  devices: "desktop",
                  label: t("Audio")
                },
                {
                  id: "showMediaLinksDownload",
                  type: "switch",
                  devices: "desktop",
                  label: t("Download")
                },
                {
                  id: "showMediaLinksNotes",
                  type: "switch",
                  devices: "desktop",
                  label: t("Notes")
                }
              ]
            },
            {
              id: "tabArticleDetail",
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
                      'Only select if "Display Video" is not selected.'
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
                      'If this is selected and you would like the image to be a fallback when no video is available make sure to select "Display Image".'
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
                  id: "showAuthor",
                  type: "switch",
                  devices: "desktop",
                  label: t("Author")
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
                  id: "showPreviousPage",
                  type: "switch",
                  devices: "desktop",
                  label: t("Previous Page")
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
