import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEkklesiaChoiches } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { toolbarParentColors } from "../toolbarParent";
import { getHelperDateFormatInputHTML } from "../utils/helpers";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = (data) => {
  const config = data.component.getGlobalConfig();
  const { v, device } = data;
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const showLatestEvents = dvv("showLatestEvents") === "on";
  return [
    {
      id: "toolbarEventFeatured",
      type: "popover",
      config: {
        icon: "t2-event-featured",
        title: t("Event Featured")
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
                  id: "showLatestEvents",
                  type: "switch",
                  devices: "desktop",
                  label: t("Show Latest"),
                  helper: {
                    content: t(
                      "This option automatically shows the latest event and overrides the 'Recent Events' and 'Event Slug' options."
                    )
                  }
                },
                {
                  id: "category",
                  devices: "desktop",
                  label: t("Category"),
                  type: "select",
                  disabled: !showLatestEvents,
                  choices: getEkklesiaChoiches(config, {
                    key: "event"
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
                  disabled: !showLatestEvents,
                  choices: getEkklesiaChoiches(config, {
                    key: "groups"
                  }),
                  helper: {
                    content: t("This option only applies to 'Show Latest'.")
                  }
                },
                {
                  id: "recentEvents",
                  devices: "desktop",
                  label: t("Recent Events"),
                  type: "select",
                  disabled: showLatestEvents || dvv("eventSlug") !== "",
                  choices: getEkklesiaChoiches(config, {
                    key: "events"
                  }),
                  helper: {
                    content: t(
                      'Select a recent event. Use only if you are not using "Event Slug" below and "Show Latest" is set to "Off".'
                    )
                  }
                },
                {
                  id: "features",
                  type: "switch",
                  devices: "desktop",
                  label: t("Featured"),
                  disabled: !showLatestEvents || dvv("nonfeatures") === "on",
                  helper: {
                    content: t(
                      "This option only applies to 'Show Latest' and if this is selected the 'No featured' option does not apply."
                    )
                  }
                },
                {
                  id: "nonfeatures",
                  type: "switch",
                  devices: "desktop",
                  label: t("Non Featured"),
                  disabled: !showLatestEvents || dvv("features") === "on",
                  helper: {
                    content: t(
                      "This option only applies to 'Show Latest' and if this is selected the 'Featured' option does not apply."
                    )
                  }
                },
                {
                  id: "eventSlug",
                  type: "inputText",
                  devices: "desktop",
                  placeholder: t("Slug..."),
                  disabled: showLatestEvents,
                  label: t("Slug"),
                  config: {
                    size: "medium"
                  },
                  helper: {
                    content: t(
                      'Slug of event (my-event-name). Use only if you are not selecting from the "Recent Events" above and "Show Latest" is set to "Off".'
                    )
                  }
                }
              ]
            },
            {
              id: "tabEventFeatured",
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
                  label: t("Image")
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
                  id: "showMetaHeadings",
                  type: "switch",
                  devices: "desktop",
                  label: t("Meta Headings")
                },
                {
                  id: "showLocation",
                  type: "switch",
                  devices: "desktop",
                  label: t("Location")
                },
                {
                  id: "showRoom",
                  type: "switch",
                  devices: "desktop",
                  label: t("Room")
                },
                {
                  id: "showCoordinator",
                  type: "switch",
                  devices: "desktop",
                  label: t("Coordinator")
                },
                {
                  id: "showCoordinatorEmail",
                  type: "switch",
                  devices: "desktop",
                  label: t("Coordinator Email")
                },
                {
                  id: "showCoordinatorPhone",
                  type: "switch",
                  devices: "desktop",
                  label: t("Coordinator Phone")
                },
                {
                  id: "showCost",
                  type: "switch",
                  devices: "desktop",
                  label: t("Cost")
                },
                {
                  id: "showWebsite",
                  type: "switch",
                  devices: "desktop",
                  label: t("Website")
                },
                {
                  id: "showRegistration",
                  type: "switch",
                  devices: "desktop",
                  label: t("Registration")
                },
                {
                  id: "showDescription",
                  type: "switch",
                  devices: "desktop",
                  label: t("Description")
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
                      'URL of event detail page. If used a link to the heading and an image will be added to take the user to the event detail page. Requires the "Event Detail" widget to be placed on a page and that page url/slug placed in this field .'
                    )
                  }
                },
                {
                  id: "detailPageButtonText",
                  type: "inputText",
                  devices: "desktop",
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
            },
            {
              id: "tabMore",
              label: t("More"),
              options: [
                {
                  id: "dateFormat",
                  type: "inputText",
                  devices: "desktop",
                  helper: {
                    enabled: true,
                    content: getHelperDateFormatInputHTML()
                  },
                  label: t("Date Format")
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
