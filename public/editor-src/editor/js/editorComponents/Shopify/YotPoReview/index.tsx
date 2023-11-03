import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { hexToRgba } from "visual/utils/color";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
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
    const imageUrlDataFromAttr = makeDataAttr({
      name: "image-url",
      value: prodFeatImg
    });
    const placeholderProductTitleDataFromAttr = makeDataAttr({
      name: "name",
      value: productTitle
    });

    const placeholderShopUrlDataFromAttr = makeDataAttr({
      name: "url",
      value: `${shopUrl}${productUrl}`
    });

    const placeholderProductDesctiptionDataFromAttr = makeDataAttr({
      name: "description",
      value: productDesc
    });

    const productIdAttr = makeDataAttr({
      name: "product-id",
      value: productId
    });

    switch (reviewType) {
      case "yotpo-main-widget":
        return (
          <div
            className="yotpo yotpo-main-widget"
            {...productIdAttr}
            {...placeholderProductTitleDataFromAttr}
            {...placeholderShopUrlDataFromAttr}
            {...imageUrlDataFromAttr}
            {...placeholderProductDesctiptionDataFromAttr}
          />
        );
      case "brz yotpo-main-widget": // added brz only for making difference for attribute data-mode
        return (
          <div
            className="yotpo yotpo-main-widget"
            {...productIdAttr}
            {...placeholderProductTitleDataFromAttr}
            {...placeholderShopUrlDataFromAttr}
            {...imageUrlDataFromAttr}
            {...placeholderProductDesctiptionDataFromAttr}
            {...makeDataAttr({ name: "mode", value: "questions" })}
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
            {...makeDataAttr({ name: "appkey", value: appKey })}
            {...makeDataAttr({
              name: "domain",
              value: domain
            })}
            {...productIdAttr}
            {...makeDataAttr({
              name: "product-models",
              value: productId
            })}
            {...placeholderProductTitleDataFromAttr}
            {...placeholderShopUrlDataFromAttr}
            {...imageUrlDataFromAttr}
            {...makeDataAttr({
              name: "description",
              value: productDesc,
              translatable: true
            })}
            {...makeDataAttr({
              name: "bread-crumbs",
              value: `{% for tag in product.tags %}${tag}`
            })}
          />
        );
      }
      case "yotpo-shoppers-say":
        return <div className="yotpo yotpo-shoppers-say" {...productIdAttr} />;
      case "yotpo-reviews-carousel": {
        const attr: Record<string, string> = {};

        if (showTotalReviewsCount === "on") {
          attr[`${makeAttr("show-bottomline")}`] = "1";
        }

        if (autoPlay === "on" && autoplaySpeed) {
          attr[`${makeAttr("autoplay-enabled")}`] = "1";
          attr[`${makeAttr("autoplay-speed")}`] = `${autoplaySpeed}`;
        }

        if (showNavigation === "on") {
          attr[`${makeAttr("show-navigation")}`] = "1";
        }

        if (headerCustomisation === "on") {
          attr[`${makeAttr("header-customisation-enabled")}`] = "1";

          attr[`${makeAttr("header-customisation-color")}`] =
            hexToRgba(colorHex, colorOpacity) ?? "";

          attr[`${makeAttr("header-customisation-font-size")}`] = `${fontSize}`;
          attr[`${makeAttr("header-customisation-text")}`] = headerText;
          attr[`${makeAttr("header-customisation-alignment")}`] = textAlign;
        }

        if (bgColorSwitch === "on") {
          attr[`${makeAttr("background-color-enabled")}`] = "1";
          attr[`${makeAttr("background-color")}`] =
            hexToRgba(bgColorHex, bgColorOpacity) ?? "";
        } else {
          attr[`${makeAttr("background-color")}`] = "transparent";
        }

        return (
          <div
            className="yotpo yotpo-reviews-carousel"
            {...makeDataAttr({ name: "mode", value: reviewLogic })}
            {...makeDataAttr({ name: "type", value: showReviews })}
            {...makeDataAttr({ name: "count", value: reviewsNumber })}
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
