import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { Props, Value } from "./types";

// @ts-expect-error advancedSettings is old option
export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  state,
  component,
  context
}) => {
  const config = Config.getAll();

  return [
    {
      id: "toolbarSermonDetail",
      type: "popover-dev",
      config: {
        icon: "t2-sermon-detail",
        title: t("Sermon Detail")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
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
                  type: "select-dev",
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
                  type: "switch-dev",
                  label: t("Video"),
                  devices: "desktop"
                },
                {
                  id: "showMediaLinksAudio",
                  type: "switch-dev",
                  label: t("Audio"),
                  devices: "desktop"
                },
                {
                  id: "showMediaLinksDownload",
                  type: "switch-dev",
                  label: t("Download"),
                  devices: "desktop"
                },
                {
                  id: "showMediaLinksNotes",
                  type: "switch-dev",
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
                  id: "showImage",
                  type: "switch-dev",
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
                  type: "switch-dev",
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
                  type: "switch-dev",
                  label: t("Audio"),
                  devices: "desktop"
                },
                {
                  id: "showTitle",
                  type: "switch-dev",
                  label: t("Title"),
                  devices: "desktop"
                },
                {
                  id: "showDate",
                  type: "switch-dev",
                  label: t("Date"),
                  devices: "desktop"
                },
                {
                  id: "showCategory",
                  type: "switch-dev",
                  label: t("Category"),
                  devices: "desktop"
                },
                {
                  id: "showGroup",
                  type: "switch-dev",
                  label: t("Group"),
                  devices: "desktop"
                },
                {
                  id: "showSeries",
                  type: "switch-dev",
                  label: t("Series"),
                  devices: "desktop"
                },
                {
                  id: "showPreacher",
                  type: "switch-dev",
                  label: t("Preacher"),
                  devices: "desktop"
                },
                {
                  id: "showPassage",
                  type: "switch-dev",
                  label: t("Passage"),
                  devices: "desktop"
                },
                {
                  id: "showMetaHeadings",
                  type: "switch-dev",
                  label: t("Meta Headings"),
                  devices: "desktop"
                },
                {
                  id: "showPreview",
                  type: "switch-dev",
                  label: t("Preview"),
                  devices: "desktop"
                },
                {
                  id: "showPreviousPage",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Previous Page")
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
