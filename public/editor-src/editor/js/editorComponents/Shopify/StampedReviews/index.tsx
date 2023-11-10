import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { hexToRgba } from "visual/utils/color";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
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
      attr[`${makeAttr("random")}`] = "true";
    }
    if (carouselTitle !== "") {
      attr[`${makeAttr("title")}`] = carouselTitle;
    }

    if (limitWords !== null) {
      attr[`${makeAttr("limit-words")}`] = `${limitWords}`;
    }
    if (minimumRating !== null) {
      attr[`${makeAttr("min-rating")}`] = minimumRating;
    }
    if (autoSlide === "on") {
      attr[`${makeAttr("auto-play")}`] = "true";
    }
    if (autoPlaySpeed) {
      attr[`${makeAttr("auto-play-speed")}`] = `${autoPlaySpeed}`;
    }
    if (fillEmpty === "on") {
      attr[`${makeAttr("fill-empty")}`] = "true";
    }
    if (feedTags !== "") {
      attr[`${makeAttr("tags")}`] = feedTags.trim().replace(/ /g, ",");
    }
    if (reviewIDs !== "") {
      attr[`${makeAttr("review-ids")}`] = reviewIDs.trim().replace(/ /g, ",");
    }
    if (productVendor !== "") {
      attr[`${makeAttr("product-brand")}`] = productVendor.trim();
    }
    if (productType !== "") {
      attr[`${makeAttr("product-category")}`] = productType.trim();
    }
    if (productIDs !== "") {
      attr[`${makeAttr("product-ids")}`] = productIDs.trim().replace(/ /g, ",");
    }
    const productId = makePlaceholder({
      content: "{{ product.id }}"
    });
    const productHandle = makePlaceholder({
      content: "{{ product.handle }}"
    });

    const hexToRgbaStarDataFromAttr = makeDataAttr({
      name: "style-color-star",
      value: hexToRgba(starColorHex, starColorOpacity)
    });

    const hexToRgbaStyleColorTextDataFromAttr = makeDataAttr({
      name: "style-color-text",
      value: hexToRgba(textColorHex, textColorOpacity)
    });

    const styleColorLinkDataFromAttr = makeDataAttr({
      name: "style-color-link",
      value: hexToRgba(linkColorHex, linkColorOpacity)
    });

    const styleColorHoverDataFromAttr = makeDataAttr({
      name: "style-color-hover",
      value: hexToRgba(hoverColorHex, hoverColorOpacity)
    });

    switch (type) {
      case "standard": {
        const shopUrl = makePlaceholder({
          content: "{{ shop.url }}"
        });
        const productUrl = makePlaceholder({
          content: "{{ product.url }}"
        });
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
            {...makeDataAttr({
              name: "widget-style",
              value: "standard"
            })}
            {...makeDataAttr({
              name: "product-id",
              value: productId
            })}
            {...makeDataAttr({
              name: "name",
              value: productTitle
            })}
            {...makeDataAttr({
              name: "url",
              value: `${shopUrl}${productUrl}`
            })}
            {...makeDataAttr({
              name: "image-url",
              value: productImage
            })}
            {...makeDataAttr({
              name: "description",
              value: productDesc,
              translatable: true
            })}
            {...makeDataAttr({
              name: "product-sku",
              value: productHandle
            })}
            {...makeDataAttr({
              name: "product-type",
              value: productType
            })}
          >
            {productReviews}
          </div>
        );
      }

      case "carousel": {
        return (
          <div
            {...attr}
            {...makeDataAttr({
              name: "widget-type",
              value: "carousel"
            })}
            {...makeDataAttr({
              name: "style-color-title",
              value: hexToRgba(titleColorHex, titleColorOpacity)
            })}
            {...hexToRgbaStarDataFromAttr}
            {...hexToRgbaStyleColorTextDataFromAttr}
            {...styleColorLinkDataFromAttr}
          />
        );
      }
      case "fullPage": {
        if (productImage === "on") {
          attr[`${makeAttr("product-image")}`] = "true";
        }

        if (labelSubtitle !== "") {
          attr[`${makeAttr("product-image")}`] = labelSubtitle;
        }

        return (
          <div
            {...makeDataAttr({
              name: "widget-type",
              value: "full-page"
            })}
            {...makeDataAttr({
              name: "style-color-verified",
              value: hexToRgba(verifiedColorHex, verifiedColorOpacity)
            })}
            {...hexToRgbaStarDataFromAttr}
            {...hexToRgbaStyleColorTextDataFromAttr}
            {...styleColorLinkDataFromAttr}
            {...attr}
          />
        );
      }
      case "topRated": {
        return (
          <div
            {...makeDataAttr({
              name: "widget-type",
              value: "top-rated"
            })}
            {...makeDataAttr({
              name: "with-photos",
              value: "false"
            })}
            {...styleColorLinkDataFromAttr}
            {...hexToRgbaStarDataFromAttr}
            {...attr}
          />
        );
      }
      case "starRating": {
        return (
          <span
            className="stamped-product-reviews-badge stamped-main-badge"
            {...makeDataAttr({
              name: "id",
              value: productId
            })}
            {...makeDataAttr({
              name: "product-sku",
              value: productHandle
            })}
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
            attr[`${makeAttr("height")}`] = `${feedHeight}${feedHeightSuffix}`;
          }
          attr[`${makeAttr("feed-type")}`] = feedType;
          attr[
            `${makeAttr("style-color-hover-opacity")}`
          ] = `${hoverOpacity.toString()}`;
        }

        return (
          <div
            {...makeDataAttr({ name: "widget-type", value: "visual-gallery" })}
            {...makeDataAttr({ name: "with-photos", value: "true" })}
            {...hexToRgbaStarDataFromAttr}
            {...styleColorHoverDataFromAttr}
            {...attr}
          />
        );
      }
      case "wallPhotos": {
        return (
          <div
            {...makeDataAttr({ name: "widget-type", value: "wall-photos" })}
            {...styleColorHoverDataFromAttr}
            {...makeDataAttr({
              name: "style-color-hover-opacity",
              value: hoverOpacity
            })}
            {...hexToRgbaStarDataFromAttr}
            {...makeDataAttr({ name: "with-photos", value: "true" })}
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
