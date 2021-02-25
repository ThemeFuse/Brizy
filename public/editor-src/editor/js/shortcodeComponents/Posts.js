import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";

export default {
  id: "Posts",
  title: t("Posts"),
  icon: "nc-wp-posts",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--posts", "wrapper-posts-posts"],
      items: [
        {
          type: "Posts",
          value: {
            _styles: ["posts", "posts-posts"],
            _version: 2,
            type: "posts",
            source:
              TARGET === "WP"
                ? "post"
                : Config.get("cms")
                ? Config.get("cms").blogId
                : undefined,
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
                        _styles: ["wrapper", "wrapper--image"],
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
                          "wrapper-postTitle-posts-posts"
                        ],
                        items: [
                          {
                            type: "WPPostsTitle",
                            value: {
                              _styles: [
                                "postTitle",
                                "postTitle-posts",
                                "postTitle-posts-posts"
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
                          "wrapper-postExcerpt-posts-posts"
                        ],
                        items: [
                          {
                            type: "WPPostExcerpt",
                            value: {
                              _styles: [
                                "postExcerpt",
                                "postExcerpt-posts",
                                "postExcerpt-posts-posts"
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
                              _styles: ["button", "button--dynamic"]
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
