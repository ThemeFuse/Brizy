import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type ReviewType =
  | "carousel"
  | "badge"
  | "productRating"
  | "productReviews"
  | "collectionRating";

export interface Value extends ElementModel {
  reviewType: ReviewType;
}

export class AreviewReviews extends EditorComponent<Value> {
  static get componentId(): "AreviewReviews" {
    return "AreviewReviews";
  }
  static defaultValue = defaultValue;

  renderAreviewWidget(type: ReviewType): ReactNode {
    switch (type) {
      case "carousel":
        return <div id="az_reviews_slider" />;

      case "badge":
        return <div id="az_budge_reviews" />;

      case "productRating":
        return <div className="areviews_header_stars" />;

      case "productReviews":
        return (
          <div
            id="Areviewsapp"
            className="page-full"
          >{`{% include 'aliexpress_reviews' %}`}</div>
        );

      case "collectionRating":
        return (
          <div
            className="areviews_product_item areviews_stars{{ product.id }}"
            data-product-id="{{ product.id }}"
          />
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
            className: "brz-shopify-areview-reviews"
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
        {...this.makeWrapperProps({ className: "brz-shopify-areview-reviews" })}
      >
        <div data-pf-type="AReview">{this.renderAreviewWidget(reviewType)}</div>
      </Wrapper>
    );
  }
}
