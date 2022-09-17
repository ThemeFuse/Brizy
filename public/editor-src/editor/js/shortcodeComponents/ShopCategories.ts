import Config, { Config as Cnf, isCMS, isWp } from "visual/global/Config";
import { isCloud } from "visual/global/Config/types";
import { IS_CLOUD } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";

const getSource = (config: Cnf): MValue<string> => {
  if (isWp(config)) {
    return "post";
  }

  if (isCMS(config)) {
    const { modules } = config;

    if (modules?.shop) {
      return modules.shop.ecwidCategoryTypeId;
    }

    return config.cms.blogId;
  }

  return undefined;
};

const getQuerySource = (config: Cnf): MValue<string> => {
  if (isCloud(config) && isCMS(config)) {
    const { modules } = config;

    if (modules?.shop) {
      return modules.shop.ecwidCategoryTypeId;
    }

    return config.cms.blogId;
  }

  return undefined;
};

export default {
  id: "ShopCategories",
  title: t("Categories"),
  icon: "nc-woo-categories",
  resolve: {
    type: "Wrapper",
    value: {
      _styles: ["wrapper", "wrapper--posts", "wrapper-posts-posts"],
      items: [
        {
          type: "Posts",
          value: {
            _styles: ["posts", "posts-posts"],
            _version: 3,
            type: "posts",
            source: getSource(Config.getAll()),
            querySource: getQuerySource(Config.getAll()),
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
                    ...(IS_CLOUD
                      ? []
                      : [
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
                          }
                        ]),
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
