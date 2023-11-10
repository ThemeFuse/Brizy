import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
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
    const productHandle = makePlaceholder({
      content: "{{ product.handle }}"
    });
    const shopUrl = makePlaceholder({
      content: "{{ shop.url }}"
    });
    const pfElementAttr = makeDataAttr({
      name: "pf-element",
      value: "true"
    });
    const urlAttr = makeDataAttr({
      name: "url",
      value: shopUrl
    });
    const handleAttr = makeDataAttr({
      name: "handle",
      value: productHandle
    });
    const limitAttr = makeDataAttr({
      name: "limit",
      value: "0"
    });

    switch (type) {
      case "reviewWidget":
        return (
          <div
            {...pfElementAttr}
            id="wc_review_section"
            className="wc_review_main_content"
            {...urlAttr}
            {...handleAttr}
            {...limitAttr}
          />
        );
      case "allStore":
        return (
          <div
            {...pfElementAttr}
            id="wc_all_review_page"
            className="wc_review_main_content"
            {...urlAttr}
            {...limitAttr}
          />
        );
      case "averageRating":
        return <div className="wc_product_review_badge" {...handleAttr} />;
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
