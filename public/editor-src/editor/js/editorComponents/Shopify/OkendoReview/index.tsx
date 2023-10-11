import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type ReviewType =
  | "star"
  | "widget"
  | "reviewCarousel"
  | "mediaCarousel"
  | "mediaGrid"
  | "badge";

export interface Value extends ElementModel {
  reviewType: ReviewType;
  showHeader: string;
  headingText: string;
  autoPlay: string;
  imageLinkText: string;
  slideSize: string;
  arrowPosition: string;
  gapSize: number;
  gapSizeSuffix: string;
  hideLoadMoreArrow: string;
  loadMoreOnScoll: string;
  desktopGridStyle: string;
  mobileGridStyle: string;
  linkText: string;
  badgePosition: string;
  badgeSize: string;
  linkToPage: string;
}

export class OkendoReview extends EditorComponent<Value> {
  static get componentId(): "OkendoReview" {
    return "OkendoReview";
  }

  static defaultValue = defaultValue;

  renderRyviuWidget(type: ReviewType, v: Value): ReactNode {
    const {
      showHeader,
      headingText,
      autoPlay,
      imageLinkText,
      slideSize,
      arrowPosition,
      gapSize,
      gapSizeSuffix,
      hideLoadMoreArrow,
      loadMoreOnScoll,
      desktopGridStyle,
      mobileGridStyle,
      linkText,
      badgePosition,
      badgeSize,
      linkToPage
    } = v;

    const attr: Record<string, string> = {};
    const productId = makePlaceholder({
      content: "{{ product.id }}"
    });
    const productListingSnippet = makePlaceholder({
      content: "{{ product.metafields.okendo.ProductListingSnippet }}"
    });
    const productReviewsSnippet = makePlaceholder({
      content: "{{ product.metafields.okendo.ProductReviewsWidgetSnippet }}"
    });

    switch (type) {
      case "star":
        return (
          <div data-pf-type="Okendo">
            <div data-oke-reviews-product-listing-rating>
              {productListingSnippet}
            </div>
          </div>
        );
      case "widget":
        return (
          <div data-pf-type="Okendo">
            <div
              className="okeReviews-widget-holder"
              data-oke-reviews-widget
              data-oke-reviews-product-id={`shopify-${productId}`}
            >
              {productReviewsSnippet}
            </div>
          </div>
        );
      case "reviewCarousel":
        if (showHeader === "off") {
          attr["data-oke-hide-header"] = "true";
          attr["data-oke-reviews-carousel-heading"] = "undefined";
        } else {
          attr["data-oke-hide-header"] = "false";
          attr["data-oke-reviews-carousel-heading"] = headingText;
        }
        return (
          <div data-pf-type="Okendo">
            <div
              data-oke-reviews-carousel
              data-oke-reviews-product-id={`shopify-${productId}`}
              {...attr}
            />
          </div>
        );
      case "mediaCarousel":
        if (autoPlay === "off") {
          attr["data-oke-reviews-autoplay"] = "false";
        } else {
          attr["data-oke-reviews-autoplay"] = "true";
        }

        return (
          <div
            data-oke-media-carousel
            data-oke-reviews-slide-link-text={imageLinkText}
            data-oke-reviews-min-images="1"
            data-oke-reviews-slide-size={slideSize}
            data-oke-reviews-arrow-position={arrowPosition}
            data-oke-reviews-product-id={`shopify-${productId}`}
            {...attr}
          />
        );

      case "mediaGrid":
        if (hideLoadMoreArrow === "off") {
          attr["data-oke-reviews-hide-arrow"] = "false";
        } else {
          attr["data-oke-reviews-hide-arrow"] = "true";
        }

        if (loadMoreOnScoll === "off") {
          attr["data-oke-reviews-load-more-on-scroll"] = "false";
        } else {
          attr["data-oke-reviews-load-more-on-scroll"] = "true";
        }

        return (
          <div
            data-oke-media-grid
            data-oke-reviews-gap-size={`${gapSize.toString()}${gapSizeSuffix}`}
            data-oke-reviews-grid-style={desktopGridStyle}
            data-oke-reviews-mobile-grid-style={mobileGridStyle}
            data-oke-reviews-cell-link-text={linkText}
            data-oke-reviews-product-id={`shopify-${productId}`}
            {...attr}
          />
        );
      case "badge":
        return (
          <div
            className={`okeReviews--${
              badgePosition === "" ? "undefined" : badgePosition
            }`}
          >
            <div
              data-oke-reviews-badge
              data-oke-reviews-badge-size={badgeSize}
              data-oke-reviews-badge-link={linkToPage}
            />
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
            className: "brz-shopify-okendo-review"
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
        {...this.makeWrapperProps({ className: "brz-shopify-okendo-review" })}
      >
        {this.renderRyviuWidget(reviewType, v)}
      </Wrapper>
    );
  }
}
