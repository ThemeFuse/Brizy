import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import toolbarConfigFn from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "../../tools/Wrapper";
import CustomCSS from "visual/component/CustomCSS";

export default class WOOPrice extends EditorComponent {
  static get componentId() {
    return "WOOPrice";
  }

  static defaultValue = defaultValue;

  state = {
    hasDiscount: false,
    hasTwoPrices: false
  };

  handleDCLoad = html => {
    this.setState({ hasDiscount: html.includes("<del>") });
    this.setState({
      hasTwoPrices:
        html.indexOf("woocommerce-Price-amount") !==
        html.lastIndexOf("woocommerce-Price-amount")
    });
  };

  renderForEdit(v, vs, vd) {
    const { hasDiscount, hasTwoPrices } = this.state;
    const { className: className_ } = v;
    const className = classnames(
      "brz-woo-price",
      className_,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const toolbarConfig = toolbarConfigFn({ hasDiscount, hasTwoPrices });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <DynamicContentHelper
              placeholder="{{editor_product_price}}"
              placeholderIcon="woo-price"
              tagName="div"
              onSuccess={this.handleDCLoad}
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}
