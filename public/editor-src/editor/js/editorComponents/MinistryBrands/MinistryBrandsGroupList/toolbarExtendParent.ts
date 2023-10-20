import { GetItems } from "visual/editorComponents/EditorComponent/types";
import Config from "visual/global/Config";
import { getCollectionTypes } from "visual/utils/api";
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

  const dvv = (key: string) => defaultValueValue({ v, key, device });

  return [
    {
      id: "toolbarGroupList",
      type: "popover-dev",
      config: {
        icon: "t2-group-list",
        title: t("Group List")
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
                  id: "category",
                  devices: "desktop",
                  label: t("Category"),
                  type: "select-dev",
                  choices: getEkklesiaChoiches({
                    key: "smallgroup",
                    url: apiUrl
                  })
                },
                {
                  id: "group",
                  devices: "desktop",
                  label: t("Group"),
                  type: "select-dev",
                  choices: getEkklesiaChoiches({ key: "groups", url: apiUrl })
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
                  type: "number-dev",
                  devices: "desktop",
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
              id: "tabGroupList",
              label: t("Display"),
              options: [
                {
                  id: "showImages",
                  label: t("Images"),
                  type: "switch-dev",
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
                  id: "showCoordinator",
                  type: "switch-dev",
                  label: t("Coordinator"),
                  devices: "desktop"
                },
                {
                  id: "showPreview",
                  type: "switch-dev",
                  label: t("Preview"),
                  devices: "desktop"
                },
                {
                  id: "showPagination",
                  type: "switch-dev",
                  label: t("Pagination"),
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
                  choices: {
                    load: () => getCollectionTypes(_config),
                    emptyLoad: {
                      title: t("There are no choices")
                    }
                  },
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
                  label: t("Button Text"),
                  disabled: !dvv("detailPage"),
                  placeholder: t("Button Text..."),
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
