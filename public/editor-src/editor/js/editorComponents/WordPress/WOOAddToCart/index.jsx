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
import * as sidebarInputConfig from "./sidebarInput";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarInput from "./toolbarInput";
import * as toolbarInputGrouped from "./toolbarInputGrouped";
import * as toolbarTableGrouped from "./toolbarTableGrouped";
import * as toolbarTableVariations from "./toolbarTableVariations";

export default class WOOAddToCart extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "WOOAddToCart";
  }

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
          contexts: this.getContexts()
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
        {({ ref: buttonRef }) => (
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
            {({ ref: tableRef }) => (
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
                {({ ref: variationsRef }) => (
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
                    {({ ref: quantityRef }) => (
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
                        {({ ref: formRef }) => (
                          <CustomCSS
                            selectorName={this.getId()}
                            css={v.customCSS}
                          >
                            {({ ref: cssRef }) => (
                              <Wrapper
                                {...this.makeWrapperProps({
                                  className,
                                  ref: (el) => {
                                    attachRefs(el, [
                                      buttonRef,
                                      tableRef,
                                      variationsRef,
                                      quantityRef,
                                      formRef,
                                      cssRef
                                    ]);
                                  }
                                })}
                              >
                                <DynamicContentHelper
                                  placeholder={placeholder}
                                  placeholderIcon="woo-addToCart"
                                  tagName="div"
                                />
                              </Wrapper>
                            )}
                          </CustomCSS>
                        )}
                      </Toolbar>
                    )}
                  </Toolbar>
                )}
              </Toolbar>
            )}
          </Toolbar>
        )}
      </Toolbar>
    );
  }
}
