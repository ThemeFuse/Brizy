import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { getEkklesiaChoiches } from "../utils/helpers";
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
  const { apiUrl } = _config.modules?.ekklesia ?? {};
  const { getSourceChoices } = _config.api?.sourceTypes ?? {};

  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const groupLatestActive = dvv("groupLatest") === "on";

  return [
    {
      id: "toolbarGroupFeatured",
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
                  id: "groupLatest",
                  type: "switch-dev",
                  devices: "desktop",
                  label: t("Show Latest"),
                  helper: {
                    content: t(
                      "This option automatically shows the latest group and overrides the 'Recent Groups' and 'Group Slug' options."
                    )
                  }
                },
                {
                  id: "category",
                  devices: "desktop",
                  label: t("Category"),
                  type: "select-dev",
                  disabled: !groupLatestActive,
                  choices: getEkklesiaChoiches({
                    key: "smallgroup",
                    url: apiUrl
                  }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "group",
                  devices: "desktop",
                  label: t("Group"),
                  type: "select-dev",
                  disabled: !groupLatestActive,
                  choices: getEkklesiaChoiches({ key: "groups", url: apiUrl }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "groupRecentList",
                  devices: "desktop",
                  label: t("Recent Groups"),
                  type: "select-dev",
                  disabled: groupLatestActive || dvv("groupSlug") !== "",
                  choices: getEkklesiaChoiches({
                    key: "smallgroups",
                    url: apiUrl
                  }),
                  helper: {
                    content: t(
                      "Select a recent group. Use only if you are not using 'Group Slug' below and 'Show Latest' is set to 'Off'."
                    )
                  }
                }
              ]
            },

            {
              id: "tabGroupFeatured",
              label: t("Display"),
              options: [
                {
                  id: "showImage",
                  type: "switch-dev",
                  label: t("Image"),
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
                  id: "showDay",
                  type: "switch-dev",
                  label: t("Day"),
                  devices: "desktop"
                },
                {
                  id: "showTimes",
                  type: "switch-dev",
                  label: t("Times"),
                  devices: "desktop"
                },
                {
                  id: "showStatus",
                  type: "switch-dev",
                  label: t("Status"),
                  devices: "desktop"
                },
                {
                  id: "showChildcare",
                  type: "switch-dev",
                  label: t("Childcare"),
                  devices: "desktop"
                },
                {
                  id: "showResourceLink",
                  type: "switch-dev",
                  label: t("Resource Link"),
                  devices: "desktop"
                },
                {
                  id: "showPreview",
                  type: "switch-dev",
                  label: t("Preview"),
                  devices: "desktop"
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
                      "URL of group detail page. If used will add a link to the heading to take the user to the group detail page. Requires the 'Group Detail' widget to be placed on a page and that page url/slug placed in this field ."
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
                  devices: "desktop",
                  label: t("Button"),
                  placeholder: t("Button Text..."),
                  disabled: !dvv("detailPage"),
                  helper: {
                    content: t(
                      "Button will display if text is entered and a detail page selected."
                    )
                  }
                },
                {
                  id: "groupSlug",
                  type: "inputText-dev",
                  devices: "desktop",
                  label: t("Slug"),
                  disabled: groupLatestActive || dvv("groupRecentList") !== "",
                  placeholder: t("Slug..."),
                  helper: {
                    content: t(
                      "Slug of group. Use only if you are not selecting from the 'Recent Groups' above and 'Show Latest' is set to 'Off'."
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
