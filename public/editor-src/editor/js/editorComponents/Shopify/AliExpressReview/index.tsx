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

export type WidgetType =
  | "star"
  | "widget"
  | "featuredMasonry"
  | "featuredCarousel"
  | "questionAnswers";

export interface Value extends ElementModel {
  widgetType: WidgetType;
}

export class AliExpressReview extends EditorComponent<Value> {
  static get componentId(): "AliExpressReview" {
    return "AliExpressReview";
  }

  static defaultValue = defaultValue;

  renderAliExpressWidget(type: WidgetType): ReactNode {
    const reviewData = makePlaceholder({
      content: "{{product.metafields.ryviu.product_reviews_info  | escape  }}"
    });
    const productId = makePlaceholder({
      content: "{{product.id}}"
    });
    const productHandle = makePlaceholder({
      content: "{{product.handle}}"
    });
    const productTitle = makePlaceholder({
      content: "{{product.title}}"
    });
    const productImage = makePlaceholder({
      content: '{{ product.featured_image.src | img_url: "100x" }}'
    });
    const starHtml = `<ryviu-widget-total reviews_data='${reviewData}' product_id='${productId}' handle='${productHandle}'/>`;

    const widgetHtml = `<ryviu-widget handle="${productHandle}" product_id="${productId}" title_product="${productTitle}" image_product="${productImage}" />`;

    const masonryHtml = "<ryviu-widget feature='1'/>";

    const carouselHtml =
      "<ryviu-feature-extend carousel='1' id='r--ryviu-widget'/>";

    const qAHtml = `<questions-answers handle="${productHandle}" product_id="${productId}"/>`;

    const ryviuProductReviewsAttr = makeDataAttr({
      name: "pt-type",
      value: "RyviuProductReviews"
    });

    switch (type) {
      case "star":
        return (
          <div {...ryviuProductReviewsAttr}>
            <div
              className="review-widget"
              dangerouslySetInnerHTML={{ __html: starHtml }}
            />
          </div>
        );
      case "widget":
        return (
          <div {...ryviuProductReviewsAttr}>
            <div
              className="lt-block-reviews"
              dangerouslySetInnerHTML={{ __html: widgetHtml }}
            />
          </div>
        );

      case "featuredMasonry":
        return (
          <div
            {...ryviuProductReviewsAttr}
            dangerouslySetInnerHTML={{ __html: masonryHtml }}
          />
        );

      case "featuredCarousel":
        return (
          <div
            {...ryviuProductReviewsAttr}
            dangerouslySetInnerHTML={{ __html: carouselHtml }}
          />
        );

      case "questionAnswers":
        return (
          <div
            {...makeDataAttr({
              name: "pt-type",
              value: "QuestionsAndAnswersRyviu"
            })}
          >
            <div
              className="lt-block-reviews"
              dangerouslySetInnerHTML={{ __html: qAHtml }}
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
            className: "brz-shopify-aliExpress-review"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(v: Value): ReactNode {
    const { widgetType } = v;

    return (
      <Wrapper
        {...this.makeWrapperProps({
          className: "brz-shopify-aliExpress-review"
        })}
      >
        {this.renderAliExpressWidget(widgetType)}
      </Wrapper>
    );
  }
}
