const { t } = global.Brizy;

export default {
  id: "WOOProducts2",
  title: t("Products"),
  icon: "nc-woo-products",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--posts", "wrapper--posts-dynamic"],
      items: [
        {
          type: "Posts",
          value: {
            taxonomy: "product_cat",
            taxonomyId: 15,
            type: "products",
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
                        _styles: ["wrapper", "wrapper--WOOPrice"],
                        items: [
                          {
                            type: "WOOPrice"
                          }
                        ]
                      }
                    },
                    {
                      type: "Cloneable",
                      value: {
                        _styles: ["wrapper-clone", "wrapper-clone--button"],
                        items: [
                          {
                            type: "Button",
                            value: {
                              _styles: ["button", "button--dynamic"],
                              text: "View or Buy"
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
