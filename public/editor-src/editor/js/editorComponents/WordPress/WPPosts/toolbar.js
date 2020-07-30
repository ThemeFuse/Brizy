import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { toolbarElementWPPostsNumber } from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvkn = key => defaultValueKey({ key, device });

  return [
    {
      id: "toolbarWPPosts",
      type: "popover-dev",
      config: {
        icon: "nc-wp-shortcode"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "WPPostsTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "queryTab",
              label: t("Query"),
              options: [
                {
                  id: "postType",
                  label: t("Post Type"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: t("Post"), value: "post" },
                    { title: t("Page"), value: "page" }
                  ]
                },
                toolbarElementWPPostsNumber({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                {
                  id: "category",
                  label: t("Category"),
                  type: "inputText-dev",
                  devices: "desktop"
                },
                {
                  id: "author",
                  label: t("Author"),
                  type: "inputText-dev",
                  devices: "desktop"
                },
                {
                  id: "include",
                  label: t("Include"),
                  type: "inputText-dev",
                  devices: "desktop"
                },
                {
                  id: "exclude",
                  label: t("Exclude"),
                  type: "inputText-dev",
                  devices: "desktop"
                },
                {
                  id: "postStatus",
                  label: t("Status"),
                  type: "select-dev",
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
                  type: "inputText-dev",
                  devices: "desktop"
                },
                {
                  id: "metaValue",
                  label: t("Meta Value"),
                  type: "inputText-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "layoutTab",
              label: "Layout",
              options: [
                {
                  id: "orderBy",
                  label: t("Order By"),
                  type: "select-dev",
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
                  type: "select-dev",
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
      type: "popover-dev",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: dvkn("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
