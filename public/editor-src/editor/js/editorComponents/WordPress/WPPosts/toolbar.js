import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarWPPosts",
      type: "popover",
      config: {
        icon: "nc-wp-shortcode"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "WPPostsTabs",
          type: "tabs",
          tabs: [
            {
              id: "queryTab",
              label: t("Query"),
              options: [
                {
                  id: "postType",
                  label: t("Post Type"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    { title: t("Post"), value: "post" },
                    { title: t("Page"), value: "page" }
                  ]
                },

                {
                  id: "numberPosts",
                  label: t("Number of posts"),
                  type: "inputText",
                  devices: "desktop"
                },
                {
                  id: "category",
                  label: t("Category"),
                  type: "inputText",
                  devices: "desktop"
                },
                {
                  id: "author",
                  label: t("Author"),
                  type: "inputText",
                  devices: "desktop"
                },
                {
                  id: "include",
                  label: t("Include"),
                  type: "inputText",
                  devices: "desktop"
                },
                {
                  id: "exclude",
                  label: t("Exclude"),
                  type: "inputText",
                  devices: "desktop"
                },
                {
                  id: "postStatus",
                  label: t("Status"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    { title: t("Publish"), value: "publish" },
                    { title: t("Future"), value: "future" },
                    { title: t("Draft"), value: "draft" },
                    { title: t("Pending"), value: "pending" },
                    { title: t("Private"), value: "private" },
                    { title: t("Trash"), value: "trash" },
                    { title: t("Auto-Draft"), value: "auto-draft" },
                    { title: t("Inherit"), value: "inherit" }
                  ]
                },
                {
                  id: "metaKey",
                  label: t("Meta Key"),
                  type: "inputText",
                  devices: "desktop"
                },
                {
                  id: "metaValue",
                  label: t("Meta Value"),
                  type: "inputText",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "layoutTab",
              label: t("Layout"),
              options: [
                {
                  id: "orderBy",
                  label: t("Order By"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    { title: t("None"), value: "none" },
                    { title: t("ID"), value: "ID" },
                    { title: t("Author"), value: "author" },
                    { title: t("Date"), value: "date" },
                    { title: t("Modified"), value: "modified" },
                    { title: t("Parent"), value: "parent" },
                    { title: t("Random"), value: "rand" },
                    { title: t("Comment Count"), value: "comment_count" },
                    { title: t("Menu order"), value: "menu_order" }
                  ]
                },
                {
                  id: "order",
                  label: t("Order"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    {
                      title: t("Asc"),
                      value: "ASC"
                    },
                    {
                      title: t("Desc"),
                      value: "DESC"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
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
              id: "grid-settings",
              width: 50,
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
              id: "grid-effects",
              width: 50,
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
    }
  ];
}
