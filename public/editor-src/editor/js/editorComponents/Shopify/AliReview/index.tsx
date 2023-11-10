import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type ReviewType =
  | "prodRatingStar"
  | "collRatingStar"
  | "reviewBox"
  | "carousel";

export interface Value extends ElementModel {
  reviewType: ReviewType;
  productSource: string;
}

export class AliReviews extends EditorComponent<Value> {
  static get componentId(): "AliReviews" {
    return "AliReviews";
  }

  static defaultValue = defaultValue;

  renderAliWidget(type: ReviewType, v: Value): ReactNode {
    const { productSource } = v;
    const pfTypeAttr = makeDataAttr({ name: "pf-type", value: "AliReviews" });
    const productId = makePlaceholder({
      content: "{{ product.id }}"
    });
    const reviewCode = makePlaceholder({
      content: "{{ shop.metafields.review_collector.review_code }}"
    });
    switch (type) {
      case "prodRatingStar":
        return (
          <div {...pfTypeAttr}>
            <div product-id={productId} className="alr-display-review-badge" />
            <div
              style={{ display: "none" }}
              id="shopify-ali-review"
              product-id={productId}
            >
              {reviewCode}
            </div>
          </div>
        );
      case "collRatingStar":
        return (
          <div {...pfTypeAttr}>
            <div
              product-id={productSource}
              className={`arv-collection arv-collection--${productSource}`}
            />
          </div>
        );

      case "reviewBox":
        return (
          <div {...pfTypeAttr}>
            <div pf-ar-element="ali-review-box" pf-widget-id="182499">
              {"{% include 'alireviews-widget-182499' %}"}
            </div>
          </div>
        );
      case "carousel":
        return (
          <div {...pfTypeAttr}>
            <div pf-ar-element="ali-carousel-slider">
              {/* need to buy a pro plan for widgets and probably undefined will be the id of widget */}
              {"{% include 'alireviews-widget-undefined' %}"}
            </div>
          </div>
        );
    }
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-reviews-ali"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(v: Value): ReactNode {
    const { reviewType } = v;

    return (
      <Wrapper
        {...this.makeWrapperProps({ className: "brz-shopify-reviews-ali" })}
      >
        {this.renderAliWidget(reviewType, v)}
      </Wrapper>
    );
  }
}
