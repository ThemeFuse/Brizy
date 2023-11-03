import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type WidgetType = "gallery" | "custom" | "star";

export interface Value extends ElementModel {
  reviewLimit: number;
  reviewType: WidgetType;
  withImage: string;
  productID: string;
}

export class LooxReview extends EditorComponent<Value> {
  static get componentId(): "LooxReview" {
    return "LooxReview";
  }

  static defaultValue = defaultValue;

  displayLooxWidget(widgetType: WidgetType, v: Value): ReactNode {
    const { productID, reviewLimit, withImage } = v;

    const attr = makeDataAttr({
      name: "limit",
      value: `${reviewLimit}`
    });

    if (withImage === "on") {
      attr[makeAttr("mode")] = "img";
    }
    switch (widgetType) {
      case "gallery":
        return (
          <div
            id="looxReviews"
            {...makeDataAttr({ name: "loox-aggregate", value: "true" })}
            {...attr}
          >
            gallery + allProductReviews
          </div>
        );

      case "custom":
        return (
          <div
            id="looxReviews"
            {...makeDataAttr({ name: "product-id", value: productID })}
            {...attr}
          />
        );

      case "star":
        return (
          <div
            className="loox-rating"
            {...makeDataAttr({ name: "fetch", value: "true" })}
            {...makeDataAttr({ name: "id", value: productID })}
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
            className: "brz-shopify-loox-review"
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
        {...this.makeWrapperProps({ className: "brz-shopify-loox-review" })}
      >
        {this.displayLooxWidget(reviewType, v)}
      </Wrapper>
    );
  }
}
