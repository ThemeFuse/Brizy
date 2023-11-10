import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
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
    const pfTypeAttr = makeDataAttr({
      name: "pf-type",
      value: "Okendo"
    });
    const okeHideHeaderAttr = makeAttr("oke-hide-header");
    const okeReviewsCarouselHeadingAttr = makeAttr(
      "oke-reviews-carousel-heading"
    );
    const okeReviewsProductIdAttr = makeDataAttr({
      name: "oke-reviews-product-id",
      value: `shopify-${productId}`
    });
    const okeReviewsAutoplayAttr = makeAttr("oke-reviews-autoplay");
    const okeReviewsHideArrowAttr = makeAttr("oke-reviews-hide-arrow");
    const okeReviewsLoadMoreOnScrollAttr = makeAttr(
      "oke-reviews-load-more-on-scroll"
    );

    switch (type) {
      case "star":
        return (
          <div {...pfTypeAttr}>
            <div
              {...makeDataAttr({
                name: "oke-reviews-product-listing-rating",
                value: "true"
              })}
            >
              {productListingSnippet}
            </div>
          </div>
        );
      case "widget":
        return (
          <div {...pfTypeAttr}>
            <div
              className="okeReviews-widget-holder"
              {...makeDataAttr({
                name: "oke-reviews-widget",
                value: "true"
              })}
              {...okeReviewsProductIdAttr}
            >
              {productReviewsSnippet}
            </div>
          </div>
        );
      case "reviewCarousel":
        if (showHeader === "off") {
          attr[`${okeHideHeaderAttr}`] = "true";
          attr[`${okeReviewsCarouselHeadingAttr}`] = "true";
        } else {
          attr[`${okeHideHeaderAttr}`] = "false";
          attr[`${okeReviewsCarouselHeadingAttr}`] = headingText;
        }
        return (
          <div {...pfTypeAttr}>
            <div
              {...makeDataAttr({ name: "oke-reviews-carousel", value: "true" })}
              {...okeReviewsProductIdAttr}
              {...attr}
            />
          </div>
        );
      case "mediaCarousel":
        if (autoPlay === "off") {
          attr[`${okeReviewsAutoplayAttr}`] = "false";
        } else {
          attr[`${okeReviewsAutoplayAttr}`] = "true";
        }

        return (
          <div
            {...makeDataAttr({
              name: "oke-media-carousel",
              value: "true"
            })}
            {...makeDataAttr({
              name: "oke-reviews-slide-link-text",
              value: imageLinkText
            })}
            {...makeDataAttr({
              name: "oke-reviews-min-images",
              value: "1"
            })}
            {...makeDataAttr({
              name: "oke-reviews-slide-size",
              value: slideSize
            })}
            {...makeDataAttr({
              name: "oke-reviews-arrow-position",
              value: arrowPosition
            })}
            {...okeReviewsProductIdAttr}
            {...attr}
          />
        );

      case "mediaGrid":
        if (hideLoadMoreArrow === "off") {
          attr[`${okeReviewsHideArrowAttr}`] = "false";
        } else {
          attr[`${okeReviewsHideArrowAttr}`] = "true";
        }

        if (loadMoreOnScoll === "off") {
          attr[`${okeReviewsLoadMoreOnScrollAttr}`] = "false";
        } else {
          attr[`${okeReviewsLoadMoreOnScrollAttr}`] = "true";
        }

        return (
          <div
            {...makeDataAttr({
              name: "oke-media-grid",
              value: "true"
            })}
            {...makeDataAttr({
              name: "oke-reviews-gap-size",
              value: `${gapSize.toString()}${gapSizeSuffix}`
            })}
            {...makeDataAttr({
              name: "oke-reviews-grid-style",
              value: desktopGridStyle
            })}
            {...makeDataAttr({
              name: "oke-reviews-mobile-grid-style",
              value: mobileGridStyle
            })}
            {...makeDataAttr({
              name: "oke-reviews-cell-link-text",
              value: linkText
            })}
            {...okeReviewsProductIdAttr}
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
              {...makeDataAttr({
                name: "oke-reviews-badge",
                value: "true"
              })}
              {...makeDataAttr({
                name: "oke-reviews-badge-size",
                value: badgeSize
              })}
              {...makeDataAttr({
                name: "oke-reviews-badge-link",
                value: linkToPage
              })}
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
