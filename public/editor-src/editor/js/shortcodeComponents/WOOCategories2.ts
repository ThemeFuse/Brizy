import { t } from "visual/utils/i18n";

export default function () {
  return {
    id: "WOOCategories2",
    title: t("Categories"),
    icon: "nc-woo-categories",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--posts", "wrapper--posts-dynamic"],
        items: [
          {
            type: "Posts",
            value: {
              type: "categories",
              _styles: ["posts-dynamic"],
              items: [
                {
                  type: "Column",
                  value: {
                    _styles: ["posts--column"],
                    items: [
                      {
                        type: "Wrapper",
                        value: {
                          _styles: ["wrapper", "wrapper--image"],
                          items: [
                            {
                              type: "Image",
                              value: {
                                _styles: ["image", "image--dynamic"]
                              }
                            }
                          ]
                        }
                      },
                      {
                        type: "Wrapper",
                        value: {
                          _styles: ["wrapper", "wrapper--WPPostsTitle"],
                          items: [
                            {
                              type: "WPPostsTitle",
                              value: {
                                fontStyle: "custom",
                                fontSize: 20,
                                tabletFontStyle: "custom",
                                tabletFontSize: 16,
                                mobileFontStyle: "custom",
                                mobileFontSize: 16,
                                contentHorizontalAlign: "center",
                                type: "woo"
                              }
                            }
                          ]
                        }
                      },
                      {
                        type: "Wrapper",
                        value: {
                          _styles: ["wrapper", "wrapper--WOOExcerpt"],
                          items: [
                            {
                              type: "WOOExcerpt",
                              value: {
                                excerptHorizontalAlign: "center"
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  };
}
