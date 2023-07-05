import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";

export default function (config: ConfigCommon) {
  return {
    id: "Posts",
    title: t("List"),
    icon: "t2-shopify-list",
    resolve: {
      type: "Wrapper",
      value: {
        _styles: ["wrapper", "wrapper--posts", "wrapper-posts-posts"],
        items: [
          {
            type: ElementTypes.Posts,
            value: {
              _styles: ["posts", "posts-posts"],
              _version: 3,
              ...config?.contentDefaults?.[ElementTypes.BlogPostList],
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
                                imagePopulation:
                                  "{{ brizy_dc_img_featured_image }}"
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
