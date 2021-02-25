import { t } from "visual/utils/i18n";

export default {
  id: "Archive",
  title: t("Archive"),
  icon: "nc-archives",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--posts", "wrapper-posts-archive"],
      items: [
        {
          type: "Posts",
          value: {
            _styles: ["posts", "posts-archive"],
            _version: 2,
            type: "archives",
            orderBy: "id",
            order: "DESC",
            items: [
              {
                type: "Column",
                value: {
                  _styles: ["posts--column"],
                  items: [
                    {
                      type: "Wrapper",
                      value: {
                        _styles: ["wrapper--image"],
                        items: [
                          {
                            type: "Image",
                            value: {
                              _styles: ["image", "image--dynamic"],
                              imagePopulation: "{{brizy_dc_img_featured_image}}"
                            }
                          }
                        ]
                      }
                    },
                    {
                      type: "Wrapper",
                      value: {
                        _styles: [
                          "wrapper",
                          "wrapper-postTitle",
                          "wrapper-postTitle-posts",
                          "wrapper-postTitle-posts-archive"
                        ],
                        items: [
                          {
                            type: "WPPostsTitle",
                            value: {
                              _styles: [
                                "postTitle",
                                "postTitle-posts",
                                "postTitle-posts-archive"
                              ]
                            }
                          }
                        ]
                      }
                    },
                    {
                      type: "Wrapper",
                      value: {
                        _styles: [
                          "wrapper",
                          "wrapper-postExcerpt",
                          "wrapper-postExcerpt-posts",
                          "wrapper-postExcerpt-posts-archive"
                        ],
                        items: [
                          {
                            type: "WPPostExcerpt",
                            value: {
                              _styles: [
                                "postExcerpt",
                                "postExcerpt-posts",
                                "postExcerpt-posts-archive"
                              ]
                            }
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
                              _styles: ["button--dynamic"]
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
