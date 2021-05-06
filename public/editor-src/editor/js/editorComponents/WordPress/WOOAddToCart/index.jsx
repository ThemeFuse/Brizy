import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as toolbarInput from "./toolbarInput";
import * as toolbarTableVariations from "./toolbarTableVariations";
import * as toolbarTableGrouped from "./toolbarTableGrouped";
import * as sidebarConfig from "./sidebar";
import * as sidebarInputConfig from "./sidebarInput";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "../../tools/Wrapper";

export default class WOOAddToCart extends EditorComponent {
  static get componentId() {
    return "WOOAddToCart";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { className: className_ } = v;
    const className = classnames(
      "brz-woo-add-to-cart",
      className_,
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        selector="button, .brz-shortcode__placeholder"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarTableGrouped,
            sidebarConfig,
            {
              allowExtend: false
            }
          )}
          selector="table.group_table"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarTableVariations,
              sidebarConfig,
              {
                allowExtend: false
              }
            )}
            selector="table.variations"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarInput,
                sidebarInputConfig,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-woo-add-to-cart:not(.grouped_form) .quantity"
            >
              <CustomCSS selectorName={this.getId()} css={v.customCSS}>
                <Wrapper
                  {...this.makeWrapperProps({
                    className
                  })}
                >
                  <DynamicContentHelper
                    placeholder="{{editor_product_add_to_cart_btn}}"
                    placeholderIcon="woo-addToCart"
                    tagName="div"
                  />
                </Wrapper>
              </CustomCSS>
            </Toolbar>
          </Toolbar>
        </Toolbar>
      </Toolbar>
    );
  }
}
