import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type UpsellType =
  | "related"
  | "recommended"
  | "recentlyViewed"
  | "trending"
  | "alsoBought"
  | "topSelling"
  | "newArrivals"
  | "featuredProducts";

export interface Value extends ElementModel {
  upsellType: UpsellType;
}
export class WiserUpsell extends EditorComponent<Value> {
  static get componentId(): "WiserUpsell" {
    return "WiserUpsell";
  }

  static defaultValue = defaultValue;

  renderWiserWidget(type: UpsellType): ReactNode {
    switch (type) {
      case "related":
        return (
          <div id="pf_wiser_related_products">
            {'{% include "wiser_related" %}'}
          </div>
        );
      case "recommended":
        return (
          <div id="pf_wiser_recommended_products">
            {'{% include "wiser_recommended" %}'}
          </div>
        );
      case "recentlyViewed":
        return (
          <div id="pf_wiser_recently_products">
            {'{% include "wiser_recentview" %}'}
          </div>
        );

      case "trending":
        return (
          <div id="pf_wiser_trending_products">
            {'{% include "wiser_trending" %}'}
          </div>
        );
      case "alsoBought":
        return (
          <div id="pf_wiser_alsobought">
            {'{% include "wiser_alsobought" %}'}
          </div>
        );
      case "topSelling":
        return (
          <div id="pf_wiser_top_selling">
            {'{% include "wiser_topselling" %}'}
          </div>
        );
      case "newArrivals":
        return (
          <div id="pf_wiser_new_arrival">
            {'{% include "wiser_newarrivals" %}'}
          </div>
        );
      case "featuredProducts":
        return (
          <div id="pf_wiser_featured_collections">
            {'{% include "wiser_featured" %}'}
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
            className: "brz-shopify-wiser-upsell"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(v: Value): ReactNode {
    const { upsellType } = v;

    return (
      <Wrapper
        {...this.makeWrapperProps({ className: "brz-shopify-wiser-upsell" })}
      >
        <div {...makeDataAttr({ name: "pf-type", value: "Wiser" })}>
          {this.renderWiserWidget(upsellType)}
        </div>
      </Wrapper>
    );
  }
}
