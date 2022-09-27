import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type WidgetType = "announcementBar" | "productBundles" | "volumeTier";

export interface Value extends ElementModel {
  widgetType: WidgetType;
}

export class SpecialOffers extends EditorComponent<Value> {
  static get componentId(): "SpecialOffers" {
    return "SpecialOffers";
  }

  static defaultValue = defaultValue;

  renderSpecialOfferWidget(type: WidgetType): ReactNode {
    switch (type) {
      case "announcementBar":
        return <div id="saso-notifications" />;
      case "productBundles":
        return <div className="saso-bundle" />;
      case "volumeTier":
        return <div className="saso-volumes" />;
    }
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-special-offers"
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
        {...this.makeWrapperProps({ className: "brz-shopify-special-offers" })}
      >
        <div data-pf-type="PixelUnion">
          {this.renderSpecialOfferWidget(widgetType)}
        </div>
      </Wrapper>
    );
  }
}
