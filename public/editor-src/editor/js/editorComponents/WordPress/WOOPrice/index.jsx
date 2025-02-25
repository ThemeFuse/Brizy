import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import toolbarConfigFn from "./toolbar";

export default class WOOPrice extends EditorComponent {
  static defaultValue = defaultValue;
  state = {
    hasDiscount: false,
    hasTwoPrices: false
  };

  static get componentId() {
    return "WOOPrice";
  }

  handleDCLoad = (html) => {
    this.setState({ hasDiscount: html.includes("</del>") });
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
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const toolbarConfig = toolbarConfigFn({ hasDiscount, hasTwoPrices });
    const placeholder = makePlaceholder({
      content: "{{editor_product_price}}"
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
                })}
              >
                <DynamicContentHelper
                  placeholder={placeholder}
                  placeholderIcon="woo-price"
                  tagName="div"
                  onSuccess={this.handleDCLoad}
                />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}
