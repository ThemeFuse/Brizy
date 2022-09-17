import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
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
    const starHtml =
      "<ryviu-widget-total reviews_data='{{product.metafields.ryviu.product_reviews_info  | escape  }}' product_id='{{product.id}}' handle='{{product.handle}}'/>";

    const widgetHtml =
      '<ryviu-widget handle="{{product.handle}}" product_id="{{product.id}}" title_product="{{product.title}}" image_product="{{ product.featured_image.src | img_url: "100x" }}" />';

    const masonryHtml = "<ryviu-widget feature='1'/>";

    const carouselHtml =
      "<ryviu-feature-extend carousel='1' id='r--ryviu-widget'/>";

    const qAHtml =
      '<questions-answers handle="{{product.handle}}" product_id="{{product.id}}"/>';

    switch (type) {
      case "star":
        return (
          <div data-pt-type="RyviuProductReviews">
            <div
              className="review-widget"
              dangerouslySetInnerHTML={{ __html: starHtml }}
            />
          </div>
        );
      case "widget":
        return (
          <div data-pt-type="RyviuProductReviews">
            <div
              className="lt-block-reviews"
              dangerouslySetInnerHTML={{ __html: widgetHtml }}
            />
          </div>
        );

      case "featuredMasonry":
        return (
          <div
            data-pt-type="RyviuProductReviews"
            dangerouslySetInnerHTML={{ __html: masonryHtml }}
          />
        );

      case "featuredCarousel":
        return (
          <div
            data-pt-type="RyviuProductReviews"
            dangerouslySetInnerHTML={{ __html: carouselHtml }}
          />
        );

      case "questionAnswers":
        return (
          <div data-pt-type="QuestionsAndAnswersRyviu">
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
