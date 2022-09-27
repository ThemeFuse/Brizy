import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import PortalToolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import { getItems as sidebar } from "./sidebar";
import { getItems as toolbar } from "./toolbar";

export interface Value extends ElementModel {
  widgetType: "default" | "sealsBadges" | "bundles" | "discounts" | "scarcity";
}

export class ReviewVitals extends EditorComponent<Value> {
  static get componentId(): "ReviewVitals" {
    return "ReviewVitals";
  }

  static defaultValue = defaultValue;

  renderVitalsWidget(str: string): ReactNode {
    switch (str) {
      case "default":
        return <div id="bundle-product_reviews" />;
      case "sealsBadges":
        return <div id="bundle-trust_badges" />;
      case "bundles":
        return <div id="bundle-product-bundles" />;
      case "discounts":
        return <div id="bundle-volume-discounts" />;
      case "scarcity":
        return <div id="vitals-stock-urgency" />;
    }
  }

  renderForEdit(v: Value): ReactNode {
    const { widgetType } = v;

    return (
      <PortalToolbar
        {...this.makeToolbarPropsFromConfig2(
          { getItems: toolbar },
          { getItems: sidebar }
        )}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-review-vitals"
          })}
        >
          {IS_EDITOR ? (
            <Placeholder icon="img" />
          ) : (
            <div> {this.renderVitalsWidget(widgetType)} </div>
          )}
        </Wrapper>
      </PortalToolbar>
    );
  }
}
