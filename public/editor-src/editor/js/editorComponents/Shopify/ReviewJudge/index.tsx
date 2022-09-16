import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type ReviewType = "widget" | "carousel" | "badge";

export interface Value extends ElementModel {
  reviewType: ReviewType;
}

export class ReviewJudgeMe extends EditorComponent<Value> {
  static get componentId(): "ReviewJudgeMe" {
    return "ReviewJudgeMe";
  }

  static defaultValue = defaultValue;

  renderJudgeReview(type: ReviewType): ReactNode {
    switch (type) {
      case "widget":
        return (
          <div className="pf-judme">
            {
              '{% include "judgeme_widgets", widget_type: "judgeme_review_widget", concierge_install: false %}'
            }
          </div>
        );
      case "carousel":
        return (
          <div className="pf-judme">{`{% include "judgeme_widgets", widget_type: "judgeme_featured_carousel", concierge_install: false %}`}</div>
        );
      case "badge":
        return (
          //on shopify it says that badges will work only in a product details component
          <div className="pf-judme">{`{% render "judgeme_widgets", widget_type: "judgeme_preview_badge", jm_style: "", concierge_install: false, product: product %}`}</div>
        );
    }
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({ className: "brz-shopify-review-judge" })}
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
        {...this.makeWrapperProps({ className: "brz-shopify-product-review" })}
      >
        {this.renderJudgeReview(reviewType)}
      </Wrapper>
    );
  }
}
