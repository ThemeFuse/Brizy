import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export type ReviewType = "product" | "averageRating" | "caRating";

export interface Value extends ElementModel {
  reviewType: ReviewType;
}

export class ReviewGrowave extends EditorComponent<Value> {
  static get componentId(): "ReviewGrowave" {
    return "ReviewGrowave";
  }

  static defaultValue = defaultValue;

  renderGrowaveWidget(widget: ReviewType): ReactNode {
    switch (widget) {
      //not sure how these will work, but: https://i.imgur.com/dbgyssL.png
      case "product":
        return (
          <div id="pf-growave-review-widget">
            {`{% capture the_snippet_reviews %}
           {% render "socialshopwave-widget-recommends", product: product %}
           {% endcapture %}
           {% unless the_snippet_reviews contains "Liquid error" %}
           {{ the_snippet_reviews }}
           {% endunless %}`}
          </div>
        );
      case "averageRating":
        return (
          <div>
            {`{% capture the_snippet_review_avg %}
          {% render "ssw-widget-avg-rate-profile", product: product, content_for_header: content_for_header %}
          {% endcapture %}
          {% unless the_snippet_review_avg contains "Liquid error" %}
          {{ the_snippet_review_avg }}
          {% endunless %}`}
          </div>
        );
      case "caRating":
        return (
          <div>
            {`{% capture the_snippet_review_avg %}
          {% render "ssw-widget-avg-rate-listing", product: product, content_for_header: content_for_header %}
          {% endcapture %}
          {% unless the_snippet_review_avg contains "Liquid error" %}
          {{ the_snippet_review_avg }}
          {% endunless %}`}
          </div>
        );
    }
  }

  renderForEdit(v: Value): React.ReactNode {
    const { reviewType } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-growave-review"
          })}
        >
          {IS_EDITOR ? (
            <Placeholder icon="img" />
          ) : (
            this.renderGrowaveWidget(reviewType)
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
