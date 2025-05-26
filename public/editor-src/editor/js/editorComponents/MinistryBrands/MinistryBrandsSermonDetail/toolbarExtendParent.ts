import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const config = data.component.getGlobalConfig();

  return [
    {
      id: "toolbarSermonDetail",
      type: "popover",
      config: {
        icon: "t2-sermon-detail",
        title: t("Sermon Detail")
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
                  id: "recentSermons",
                  label: t("Recent Sermons"),
                  type: "select",
                  devices: "desktop",
                  choices: getEkklesiaChoiches(config, {
                    key: "recentSermons"
                  }),
                  helper: {
                    content: t(
                      "Select a recent sermon as an example to style/setup. Since this is the sermon detail landing page this sermon will be replaced with the linked sermon."
                    )
                  }
                }
              ]
            },
            {
              id: "tabButtons",
              label: t("Buttons"),
              options: [
                {
                  id: "showMediaLinksVideo",
                  type: "switch",
                  label: t("Video"),
                  devices: "desktop"
                },
                {
                  id: "showMediaLinksAudio",
                  type: "switch",
                  label: t("Audio"),
                  devices: "desktop"
                },
                {
                  id: "showMediaLinksDownload",
                  type: "switch",
                  label: t("Download"),
                  devices: "desktop"
                },
                {
                  id: "showMediaLinksNotes",
                  type: "switch",
                  label: t("Notes"),
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tabSermonDetail",
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
                  label: t("Image"),
                  devices: "desktop",
                  helper: {
                    content: t(
                      "Only select if 'Display Video' is not selected."
                    )
                  }
                },
                {
                  id: "showVideo",
                  type: "switch",
                  label: t("Video"),
                  devices: "desktop",
                  helper: {
                    content: t(
                      "If this is selected and you would like the image to be a fallback when no video is available make sure to select 'Display Images'."
                    )
                  }
                },
                {
                  id: "showAudio",
                  type: "switch",
                  label: t("Audio"),
                  devices: "desktop"
                },
                {
                  id: "showTitle",
                  type: "switch",
                  label: t("Title"),
                  devices: "desktop"
                },
                {
                  id: "showDate",
                  type: "switch",
                  label: t("Date"),
                  devices: "desktop"
                },
                {
                  id: "showCategory",
                  type: "switch",
                  label: t("Category"),
                  devices: "desktop"
                },
                {
                  id: "showGroup",
                  type: "switch",
                  label: t("Group"),
                  devices: "desktop"
                },
                {
                  id: "showSeries",
                  type: "switch",
                  label: t("Series"),
                  devices: "desktop"
                },
                {
                  id: "showPreacher",
                  type: "switch",
                  label: t("Preacher"),
                  devices: "desktop"
                },
                {
                  id: "showPassage",
                  type: "switch",
                  label: t("Passage"),
                  devices: "desktop"
                },
                {
                  id: "showMetaHeadings",
                  type: "switch",
                  label: t("Meta Headings"),
                  devices: "desktop"
                },
                {
                  id: "showPreview",
                  type: "switch",
                  label: t("Preview"),
                  devices: "desktop"
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
