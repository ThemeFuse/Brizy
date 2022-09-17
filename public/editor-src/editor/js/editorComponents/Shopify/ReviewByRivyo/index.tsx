import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type ReviewType = "reviewWidget" | "allStore" | "averageRating";

export interface Value extends ElementModel {
  reviewType: ReviewType;
}

export class ReviewRivyo extends EditorComponent<Value> {
  static get componentId(): "ReviewRivyo" {
    return "ReviewRivyo";
  }

  static defaultValue = defaultValue;

  renderRivyoWidget(type: ReviewType): ReactNode {
    switch (type) {
      case "reviewWidget":
        return (
          <div
            data-pf-element="true"
            id="wc_review_section"
            className="wc_review_main_content"
            data-url="{{ shop.url }}"
            data-handle="{{ product.handle }}"
            data-limit="0"
          />
        );
      case "allStore":
        return (
          <div
            data-pf-element="true"
            id="wc_all_review_page"
            className="wc_review_main_content"
            data-url="{{ shop.url }}"
            data-limit="0"
          />
        );
      case "averageRating":
        return (
          <div
            className="wc_product_review_badge"
            data-handle="{{ product.handle }}"
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
          {...this.makeWrapperProps({ className: "brz-shopify-rivyo-review" })}
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
        {...this.makeWrapperProps({ className: "brz-shopify-rivyo-review" })}
      >
        {this.renderRivyoWidget(reviewType)}
      </Wrapper>
    );
  }
}
