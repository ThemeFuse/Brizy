import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { hexToRgba } from "visual/utils/color";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type ReviewType =
  | "standard"
  | "carousel"
  | "fullPage"
  | "topRated"
  | "starRating"
  | "visualGallery"
  | "wallPhotos";

export interface Value extends ElementModel {
  reviewType: ReviewType;
  carouselTitle: string;
  productImage: string;
  reviewIDs: string;
  productType: string;
  productVendor: string;
  limitWords: number;
  feedTags: string;
  minimumRating: string;
  fillEmpty: string;
  randomizer: string;
  autoSlide: string;
  autoPlaySpeed: number;
  productIDs: string;
  titleColorHex: string;
  titleColorOpacity: number;
  starColorHex: string;
  starColorOpacity: number;
  textColorHex: string;
  textColorOpacity: number;
  linkColorHex: string;
  linkColorOpacity: number;
  hoverColorHex: string;
  hoverColorOpacity: number;
  labelSubtitle: string;
  verifiedColorHex: string;
  verifiedColorOpacity: number;
  feedType: string;
  feedHeight: number;
  feedHeightSuffix: string;
  hoverOpacity: number;
}

export class StampedReviews extends EditorComponent<Value> {
  static get componentId(): "StampedReviews" {
    return "StampedReviews";
  }

  static defaultValue = defaultValue;

  displayStampedWidget(type: ReviewType, v: Value): ReactNode {
    const {
      reviewIDs,
      carouselTitle,
      labelSubtitle,
      autoSlide,
      autoPlaySpeed,
      productType,
      productVendor,
      productImage,
      limitWords,
      minimumRating,
      productIDs,
      titleColorHex,
      titleColorOpacity,
      starColorHex,
      starColorOpacity,
      textColorHex,
      textColorOpacity,
      linkColorHex,
      linkColorOpacity,
      feedType,
      hoverColorHex,
      hoverColorOpacity,
      hoverOpacity,
      verifiedColorHex,
      verifiedColorOpacity,
      feedTags,
      feedHeight,
      feedHeightSuffix,
      fillEmpty,
      randomizer
    } = v;

    const attr: Record<string, string> = {
      id: "stamped-reviews-widget"
    };

    if (randomizer === "on") {
      attr["data-random"] = "true";
    }
    if (carouselTitle !== "") {
      attr["data-title"] = carouselTitle;
    }

    if (limitWords !== null) {
      attr["data-limit-words"] = `${limitWords}`;
    }
    if (minimumRating !== null) {
      attr["data-min-rating"] = minimumRating;
    }
    if (autoSlide === "on") {
      attr["data-auto-play"] = "true";
    }
    if (autoPlaySpeed) {
      attr["data-auto-play-speed"] = `${autoPlaySpeed}`;
    }
    if (fillEmpty === "on") {
      attr["data-fill-empty"] = "true";
    }
    if (feedTags !== "") {
      attr["data-tags"] = feedTags.trim().replace(/ /g, ",");
    }
    if (reviewIDs !== "") {
      attr["data-review-ids"] = reviewIDs.trim().replace(/ /g, ",");
    }
    if (productVendor !== "") {
      attr["data-product-brand"] = productVendor.trim();
    }
    if (productType !== "") {
      attr["data-product-category"] = productType.trim();
    }
    if (productIDs !== "") {
      attr["data-product-ids"] = productIDs.trim().replace(/ /g, ",");
    }
    const productId = makePlaceholder({
      content: "{{ product.id }}"
    });
    const productHandle = makePlaceholder({
      content: "{{ product.handle }}"
    });

    switch (type) {
      case "standard": {
        const shopUrl = makePlaceholder({ content: "{{ shop.url }}" });
        const productUrl = makePlaceholder({ content: "{{ product.url }}" });
        const productTitle = makePlaceholder({
          content: "{{ product.title | escape }}"
        });
        const productImage = makePlaceholder({
          content:
            "{{ product.featured_image | product_img_url: 'large' |replace: '?', '%3F' | replace: '&','%26'}}"
        });
        const productDesc = makePlaceholder({
          content: "{{ product.description | escape }}"
        });

        const productType = makePlaceholder({
          content: "{{ product.type }}"
        });
        const productReviews = makePlaceholder({
          content: "{{ product.metafields.stamped.reviews }}"
        });

        return (
          <div
            id="stamped-main-widget"
            className="stamped-main-widget"
            data-widget-style="standard"
            data-product-id={productId}
            data-name={productTitle}
            data-url={`${shopUrl}${productUrl}`}
            data-image-url={productImage}
            data-description={productDesc}
            data-product-sku={productHandle}
            data-product-type={productType}
          >
            {productReviews}
          </div>
        );
      }

      case "carousel": {
        return (
          <div
            data-widget-type="carousel"
            {...attr}
            data-style-color-title={hexToRgba(titleColorHex, titleColorOpacity)}
            data-style-color-star={hexToRgba(starColorHex, starColorOpacity)}
            data-style-color-text={hexToRgba(textColorHex, textColorOpacity)}
            data-style-color-link={hexToRgba(linkColorHex, linkColorOpacity)}
          />
        );
      }

      case "fullPage": {
        if (productImage === "on") {
          attr["data-product-image"] = "true";
        }

        if (labelSubtitle !== "") {
          attr["data-label-subtitle"] = labelSubtitle;
        }

        return (
          <div
            data-widget-type="full-page"
            data-style-color-verified={hexToRgba(
              verifiedColorHex,
              verifiedColorOpacity
            )}
            data-style-color-star={hexToRgba(starColorHex, starColorOpacity)}
            data-style-color-text={hexToRgba(textColorHex, textColorOpacity)}
            data-style-color-link={hexToRgba(linkColorHex, linkColorOpacity)}
            {...attr}
          />
        );
      }
      case "topRated": {
        return (
          <div
            data-widget-type="top-rated"
            data-with-photos="false"
            data-style-color-link={hexToRgba(linkColorHex, linkColorOpacity)}
            data-style-color-star={hexToRgba(starColorHex, starColorOpacity)}
            {...attr}
          />
        );
      }
      case "starRating": {
        return (
          <span
            className="stamped-product-reviews-badge stamped-main-badge"
            data-id={productId}
            data-product-sku={productHandle}
            style={{ display: "inline-block" }}
          >
            {makePlaceholder({
              content: "{{ product.metafields.stamped.badge }}"
            })}
          </span>
        );
      }

      case "visualGallery": {
        if (feedType !== "") {
          if (feedType === "carousel") {
            attr["data-height"] = `${feedHeight}${feedHeightSuffix}`;
          }
          attr["data-feed-type"] = feedType;
          attr["data-style-color-hover-opacity"] = `${hoverOpacity.toString()}`;
        }

        return (
          <div
            data-widget-type="visual-gallery"
            data-with-photos="true"
            data-style-color-star={hexToRgba(starColorHex, starColorOpacity)}
            data-style-color-hover={hexToRgba(hoverColorHex, hoverColorOpacity)}
            {...attr}
          />
        );
      }
      case "wallPhotos": {
        return (
          <div
            data-widget-type="wall-photos"
            data-style-color-hover={hexToRgba(hoverColorHex, hoverColorOpacity)}
            data-style-color-hover-opacity={hoverOpacity.toString()}
            data-style-color-star={hexToRgba(starColorHex, starColorOpacity)}
            data-with-photos="true"
            {...attr}
          />
        );
      }
    }
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-stamped-reviews"
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
        {...this.makeWrapperProps({ className: "brz-shopify-stamped-reviews" })}
      >
        {this.displayStampedWidget(reviewType, v)}
      </Wrapper>
    );
  }
}
