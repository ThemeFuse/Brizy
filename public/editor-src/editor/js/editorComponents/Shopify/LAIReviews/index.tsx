import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type WidgetType = "star" | "widget" | "homePageReview" | "showcase";

export interface Value extends ElementModel {
  widgetType: WidgetType;
}

export class LaiReviews extends EditorComponent<Value> {
  static get componentId(): "LaiReviews" {
    return "LaiReviews";
  }
  static defaultValue = defaultValue;

  renderLaiWidget(type: WidgetType): ReactNode {
    switch (type) {
      case "star":
        return (
          <div
            className="scm-reviews-rate"
            data-rate-version2={`{{ product.metafields.scm_review_importer.reviewsData.reviewCountInfo | json }}`}
            data-product-id={`{{ product.id }}`}
          />
        );

      case "widget":
        return (
          <>
            {`{% render "reviews-importer",product : product %}`}
            <div className="scm-container custom" style={{ display: "none" }}>
              <div id="scm-reviews-importer" className="scm-reviews-importer">
                <iframe id="scm-reviews-importer-iframe" width="100%" />
              </div>
            </div>
          </>
        );
      case "homePageReview":
        return <>{`{% render "lai-home-page" %}`}</>;
      case "showcase":
        return <>{`{% render "reviews-happy-page" %}`}</>;
    }
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-lai-reviews"
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
        {...this.makeWrapperProps({ className: "brz-shopify-lai-reviews" })}
      >
        <div data-pf-type="LaiReviews">{this.renderLaiWidget(widgetType)}</div>
      </Wrapper>
    );
  }
}
