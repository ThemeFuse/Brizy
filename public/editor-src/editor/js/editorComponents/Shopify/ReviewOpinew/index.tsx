import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import PortalToolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { makePlaceholder } from "visual/utils/dynamicContent";
import defaultValue from "./defaultValue.json";
import { getItems as sidebar } from "./sidebar";
import { getItems as toolbar } from "./toolbar";

export type ReviewType =
  | "default"
  | "allReviews"
  | "productReview"
  | "collectionReviewStar"
  | "avgStoreReview";

export interface Value extends ElementModel {
  reviewType: ReviewType;
  badgeSize: string;
}

export class ReviewOpinew extends EditorComponent<Value> {
  static get componentId(): "ReviewOpinew" {
    return "ReviewOpinew";
  }

  static defaultValue = defaultValue;

  renderOpinewWidget(type: ReviewType, size: string): ReactNode {
    switch (type) {
      case "default":
        return (
          <>
            <div style={{ clear: "both" }} />
            <div id="opinew-reviews-product-page-code" data-pf-element="true">
              <span
                id="opinew-plugin"
                data-server-address="https://www.opinew.com"
                data-opinew-shop-id={makePlaceholder({
                  content: "{{shop.id}}"
                })}
                data-shop-url={makePlaceholder({ content: "{{shop.domain}}" })}
                data-platform-product-id={makePlaceholder({
                  content: "{{product.id}}"
                })}
                data-opw-prodreviews={makePlaceholder({
                  content:
                    '{{ product.metafields.opinew_metafields["product_plugin"] }}'
                })}
              >
                <span id="opinew_product_plugin_app" />
              </span>
            </div>
          </>
        );

      case "allReviews":
        return (
          <>
            <div style={{ clear: "both" }} />
            <div
              id="opinew-reviews-all-reviews-code"
              data-opw-prodreviews={makePlaceholder({
                content: '{{ shop.metafields.opinew["opinew_all_reviews"] }}'
              })}
            >
              <span id="opinew_all_reviews_plugin_app" />
            </div>
          </>
        );

      case "productReview":
        return (
          <div id="opinew-stars-plugin-product">
            {'{% include "opinew_review_stars_product" %}'}
          </div>
        );

      case "collectionReviewStar":
        return (
          <div className="opinew-stars-plugin-product-list">
            {'{% include "opinew_review_stars_lists" %}'}
          </div>
        );

      case "avgStoreReview":
        return (
          <>
            <div style={{ clear: "both" }} />
            <div id="opinew-reviews-all-reviews-code">
              <span id="opinew-shop-plugin">
                {size === "average"
                  ? makePlaceholder({
                      content:
                        '{{ shop.metafields.opinew["opinew_badge_wide_average"] }}'
                    })
                  : size === "small"
                  ? makePlaceholder({
                      content:
                        '{{ shop.metafields.opinew["opinew_badge_small"] }}'
                    })
                  : makePlaceholder({
                      content:
                        '{{ shop.metafields.opinew["opinew_badge_wide"] }}'
                    })}
              </span>
            </div>
          </>
        );
    }
  }

  renderForEdit(v: Value): React.ReactNode {
    const { reviewType, badgeSize } = v;

    return (
      <PortalToolbar
        {...this.makeToolbarPropsFromConfig2(
          { getItems: toolbar },
          { getItems: sidebar }
        )}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-review-vitals"
          })}
        >
          {IS_EDITOR ? (
            <Placeholder icon="img" />
          ) : (
            this.renderOpinewWidget(reviewType, badgeSize)
          )}
        </Wrapper>
      </PortalToolbar>
    );
  }
}
