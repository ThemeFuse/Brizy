import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarWPPosts",
      type: "popover",
      icon: "nc-wp-shortcode",
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
                  choices: [
                    { title: t("Post"), value: "post" },
                    { title: t("Page"), value: "page" }
                  ],
                  value: v.postType
                },
                {
                  id: "numberPosts",
                  label: t("Number posts"),
                  type: "input",
                  value: {
                    value: v.numberPosts
                  },
                  onChange: ({ value: numberPosts }) => ({
                    numberPosts
                  })
                },
                {
                  id: "category",
                  label: t("Category"),
                  type: "input",
                  value: {
                    value: v.category
                  },
                  onChange: ({ value: category }) => ({
                    category
                  })
                },
                {
                  id: "author",
                  label: t("Author"),
                  type: "input",
                  value: {
                    value: v.author
                  },
                  onChange: ({ value: author }) => ({
                    author
                  })
                },
                {
                  id: "include",
                  label: t("Include"),
                  type: "input",
                  value: {
                    value: v.include
                  },
                  onChange: ({ value: include }) => ({
                    include
                  })
                },
                {
                  id: "exclude",
                  label: t("Exclude"),
                  type: "input",
                  value: {
                    value: v.exclude
                  },
                  onChange: ({ value: exclude }) => ({
                    exclude
                  })
                },
                {
                  id: "postStatus",
                  label: "Status",
                  type: "select",
                  choices: [
                    { title: t("Publish"), value: "publish" },
                    { title: t("Future"), value: "future" },
                    { title: t("Draft"), value: "draft" },
                    { title: t("Pending"), value: "pending" },
                    { title: t("Private"), value: "private" },
                    { title: t("Trash"), value: "trash" },
                    { title: t("Auto-Draft"), value: "auto-draft" },
                    { title: t("Inherit"), value: "inherit" }
                  ],
                  value: v.postStatus
                },
                {
                  id: "metaKey",
                  label: t("Meta Key"),
                  type: "input",
                  value: {
                    value: v.metaKey
                  },
                  onChange: ({ value: metaKey }) => ({
                    metaKey
                  })
                },
                {
                  id: "metaValue",
                  label: t("Meta Value"),
                  type: "input",
                  value: {
                    value: v.metaValue
                  },
                  onChange: ({ value: metaValue }) => ({
                    metaValue
                  })
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
                  type: "select",
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
                  ],
                  value: v.orderBy
                },
                {
                  id: "order",
                  label: t("Order"),
                  type: "select",
                  choices: [
                    {
                      title: t("Asc"),
                      value: "ASC"
                    },
                    {
                      title: t("Desc"),
                      value: "DESC"
                    }
                  ],
                  value: v.order
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
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.width
          },
          onChange: ({ value: width }) => {
            return {
              width,
              mobileWidth: v.width === v.mobileWidth ? width : v.mobileWidth
            };
          }
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "mobileWidth",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.mobileWidth
          },
          onChange: ({ value: mobileWidth }) => {
            return {
              mobileWidth
            };
          }
        }
      ]
    }
  ];
}
