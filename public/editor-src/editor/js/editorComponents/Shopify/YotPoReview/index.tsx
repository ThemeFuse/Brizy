import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { hexToRgba } from "visual/utils/color";
import { makePlaceholder } from "visual/utils/dynamicContent";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export type ReviewType =
  | "yotpo-main-widget"
  | "brz yotpo-main-widget"
  | "bottomLine"
  | "yotpo-shoppers-say"
  | "yotpo-reviews-carousel"
  | "yotpo-badge";

export interface Value extends ElementModel {
  appKey: string;
  autoplaySpeed: number;
  fontSize: number;
  headerText: string;
  textAlign: string;
  reviewType: ReviewType;
  reviewLogic: string;
  showTotalReviewsCount: string;
  showReviews: string;
  reviewsNumber: number;
  autoPlay: string;
  showNavigation: string;
  bgColorSwitch: string;
  headerCustomisation: string;
  colorHex: string;
  colorOpacity: number;
  bgColorHex: string;
  bgColorOpacity: number;
}

export class YotPoReview extends EditorComponent<Value> {
  static get componentId(): "YotPoReview" {
    return "YotPoReview";
  }
  static defaultValue = defaultValue;

  renderWidget(reviewType: ReviewType, v: Value): ReactNode {
    const {
      appKey,
      reviewLogic,
      showTotalReviewsCount,
      showReviews,
      reviewsNumber,
      autoPlay,
      autoplaySpeed,
      showNavigation,
      headerCustomisation,
      colorHex,
      colorOpacity,
      fontSize,
      headerText,
      textAlign,
      bgColorSwitch,
      bgColorHex,
      bgColorOpacity
    } = v;

    const prodFeatImg = makePlaceholder({
      content:
        '{{ product.featured_image | product_img_url: "large" | replace: "?", "%3F" | replace: "&","%26" }}'
    });
    const productTitle = makePlaceholder({
      content: "{{ product.title | escape }}"
    });
    const productId = makePlaceholder({
      content: "{{ product.id }}"
    });
    const shopUrl = makePlaceholder({
      content: "{{ shop.url }}"
    });
    const productUrl = makePlaceholder({
      content: "{{ product.url }}"
    });
    const productDesc = makePlaceholder({
      content: "{{ product.description | escape }}"
    });

    switch (reviewType) {
      case "yotpo-main-widget":
        return (
          <div
            className="yotpo yotpo-main-widget"
            data-product-id={productId}
            data-name={productTitle}
            data-url={`${shopUrl}${productUrl}`}
            data-image-url={prodFeatImg}
            data-description={productDesc}
          />
        );
      case "brz yotpo-main-widget": // added brz only for making difference for attribute data-mode
        return (
          <div
            className="yotpo yotpo-main-widget"
            data-product-id={productId}
            data-name={productTitle}
            data-url={`${shopUrl}${productUrl}`}
            data-image-url={prodFeatImg}
            data-description={productDesc}
            data-mode="questions"
          />
        );
      case "bottomLine": {
        const domain = makePlaceholder({
          content: "{{ shop.permanent_domain | escape }}"
        });
        const tag = makePlaceholder({ content: "{{ tag | escape }}}" });

        return (
          <div
            className="yotpo bottomLine"
            data-appkey={appKey}
            data-domain={domain}
            data-product-id={productId}
            data-product-models={productId}
            data-name={productTitle}
            data-url={`${shopUrl}${productUrl}`}
            data-image-url={prodFeatImg}
            data-description={productDesc}
            data-bread-crumbs={`{% for tag in product.tags %}${tag}`}
          />
        );
      }
      case "yotpo-shoppers-say":
        return (
          <div
            className="yotpo yotpo-shoppers-say"
            data-product-id={productId}
          />
        );
      case "yotpo-reviews-carousel": {
        const attr: Record<string, string> = {};

        if (showTotalReviewsCount === "on") {
          attr["data-show-bottomline"] = "1";
        }

        if (autoPlay === "on" && autoplaySpeed) {
          attr["data-autoplay-enabled"] = "1";
          attr["data-autoplay-speed"] = `${autoplaySpeed}`;
        }

        if (showNavigation === "on") {
          attr["data-show-navigation"] = "1";
        }

        if (headerCustomisation === "on") {
          attr["data-header-customisation-enabled"] = "1";

          attr["data-header-customisation-color"] =
            hexToRgba(colorHex, colorOpacity) ?? "";

          attr["data-header-customisation-font-size"] = `${fontSize}`;
          attr["data-header-customisation-text"] = headerText;
          attr["data-header-customisation-alignment"] = textAlign;
        }

        if (bgColorSwitch === "on") {
          attr["data-background-color-enabled"] = "1";
          attr["data-background-color"] =
            hexToRgba(bgColorHex, bgColorOpacity) ?? "";
        } else {
          attr["data-background-color"] = "transparent";
        }

        return (
          <div
            className="yotpo yotpo-reviews-carousel"
            data-mode={reviewLogic}
            data-type={showReviews}
            data-count={reviewsNumber.toString()}
            {...attr}
          />
        );
      }
      case "yotpo-badge":
        return <div id="y-badges" className="yotpo yotpo-badge badge-init" />;
    }
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper {...this.makeWrapperProps({ className: "brz-yotpo-review" })}>
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(v: Value): React.ReactNode {
    const { reviewType } = v;

    return (
      <Wrapper {...this.makeWrapperProps({ className: "brz-yotpo-review" })}>
        {this.renderWidget(reviewType, v)}
      </Wrapper>
    );
  }
}
