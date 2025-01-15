import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (props) => {
  const config = props.component.getGlobalConfig();


  return [
    {
      id: "toolbarStaffDetail",
      type: "popover",
      config: {
        icon: "t2-staff-detail",
        title: t("Staff Detail")
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
                  id: "recentStaff",
                  label: t("Recent Staff"),
                  type: "select",
                  devices: "desktop",
                  choices: getEkklesiaChoiches(config, {
                    key: "staff"
                  }),
                  helper: {
                    content: t(
                      "Select a recent staff member as an example to style/setup.  Since this is the staff detail landing page this member will be replaced with the linked staff."
                    )
                  }
                }
              ]
            },
            {
              id: "tabStaffDetail",
              label: t("Display"),
              options: [
                {
                  id: "showMetaIcons",
                  type: "switch",
                  label: t("Meta Icons"),
                  devices: "desktop"
                },
                {
                  id: "showImage",
                  type: "switch",
                  label: t("Image"),
                  devices: "desktop"
                },
                {
                  id: "showTitle",
                  type: "switch",
                  label: t("Title"),
                  devices: "desktop"
                },
                {
                  id: "showPosition",
                  type: "switch",
                  label: t("Position"),
                  devices: "desktop"
                },
                {
                  id: "showGroups",
                  type: "switch",
                  label: t("Groups"),
                  devices: "desktop"
                },
                {
                  id: "showPhoneWork",
                  type: "switch",
                  label: t("Work Phone"),
                  devices: "desktop"
                },
                {
                  id: "showPhoneCell",
                  type: "switch",
                  label: t("Cell Phone"),
                  devices: "desktop"
                },
                {
                  id: "showEmail",
                  type: "switch",
                  label: t("Email"),
                  devices: "desktop"
                },
                {
                  id: "showFacebook",
                  type: "switch",
                  label: t("Facebook"),
                  devices: "desktop"
                },
                {
                  id: "showTwitter",
                  type: "switch",
                  label: t("Twitter"),
                  devices: "desktop"
                },
                {
                  id: "showInstagram",
                  type: "switch",
                  label: t("Instagram"),
                  devices: "desktop"
                },
                {
                  id: "showWebsite",
                  type: "switch",
                  label: t("Website"),
                  devices: "desktop"
                },
                {
                  id: "showRss",
                  type: "switch",
                  label: t("Rss"),
                  devices: "desktop"
                },
                {
                  id: "showMetaHeadings",
                  type: "switch",
                  label: t("Meta Headings"),
                  devices: "desktop"
                },
                {
                  id: "showAboutText",
                  type: "switch",
                  label: t("About Text"),
                  devices: "desktop"
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
