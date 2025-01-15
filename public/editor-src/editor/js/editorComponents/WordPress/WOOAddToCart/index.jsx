import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as sidebarInputConfig from "./sidebarInput";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarInput from "./toolbarInput";
import * as toolbarInputGrouped from "./toolbarInputGrouped";
import * as toolbarTableGrouped from "./toolbarTableGrouped";
import * as toolbarTableVariations from "./toolbarTableVariations";

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
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
    const placeholder = makePlaceholder({
      content: "{{editor_product_add_to_cart_btn}}"
    });

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
              selector=".brz-woo-add-to-cart .cart:not(.grouped_form) .quantity"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarInputGrouped,
                  sidebarInputConfig,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-woo-add-to-cart .grouped_form .quantity"
              >
                <CustomCSS selectorName={this.getId()} css={v.customCSS}>
                  <Wrapper
                    {...this.makeWrapperProps({
                      className
                    })}
                  >
                    <DynamicContentHelper
                      placeholder={placeholder}
                      placeholderIcon="woo-addToCart"
                      tagName="div"
                    />
                  </Wrapper>
                </CustomCSS>
              </Toolbar>
            </Toolbar>
          </Toolbar>
        </Toolbar>
      </Toolbar>
    );
  }
}
