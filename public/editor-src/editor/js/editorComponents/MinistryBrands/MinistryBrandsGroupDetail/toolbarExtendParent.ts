import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { toolbarParentColors } from "../toolbarParent";
import { getEkklesiaChoiches } from "../utils/helpers";
import { Props, Value } from "./types";

// @ts-expect-error advancedSettings is old option
export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  component,
  context,
  state
}) => {
  const { apiUrl } = Config.getAll()?.modules?.ekklesia ?? {};

  return [
    {
      id: "toolbarGroupDetail",
      type: "popover-dev",
      config: {
        icon: "t2-group-detail",
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
          devices: "desktop",
          tabs: [
            {
              id: "tabSettings",
              label: t("Settings"),
              options: [
                {
                  id: "groupsRecent",
                  label: t("Recent Groups"),
                  type: "select-dev",
                  choices: getEkklesiaChoiches({
                    key: "smallgroups",
                    url: apiUrl
                  })
                }
              ]
            },
            {
              id: "tabGroupDetail",
              label: t("Display"),
              options: [
                {
                  id: "showImage",
                  type: "switch-dev",
                  label: t("Image")
                },
                {
                  id: "showTitle",
                  type: "switch-dev",
                  label: t("Title")
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
                  id: "showMetaHeadings",
                  type: "switch-dev",
                  label: t("Meta Headings")
                },
                {
                  id: "showDay",
                  type: "switch-dev",
                  label: t("Day")
                },
                {
                  id: "showTimes",
                  type: "switch-dev",
                  label: t("Times")
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
                  label: t("Resource Link")
                },
                {
                  id: "showContent",
                  type: "switch-dev",
                  label: t("Content")
                },
                {
                  id: "showPreviousPage",
                  type: "switch-dev",
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
