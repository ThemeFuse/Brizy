import classnames from "classnames";
import jQuery from "jquery";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { getTerms } from "visual/utils/api";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { attachRefs } from "visual/utils/react";
import { DynamicContentHelper } from "../common/DynamicContentHelper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import toolbarConfigFn from "./toolbar";

// NOTE: woocommerce_* because of backwards compatibility
const shortcodeToPlaceholder = {
  woocommerce_cart: () =>
    makePlaceholder({ content: "{{editor_product_default_cart}}" }),
  woocommerce_checkout: () =>
    makePlaceholder({ content: "{{editor_product_checkout}}" }),
  woocommerce_my_account: () =>
    makePlaceholder({ content: "{{editor_product_my_account}}" }),
  woocommerce_order_tracking: () =>
    makePlaceholder({ content: "{{editor_product_order_tracking}}" }),
  product: ({ productID }) =>
    makePlaceholder({
      content: "{{editor_product_page}}",
      attr: { itemId: productID }
    }),
  products: ({ limit, category, columns, orderBy, order }) =>
    makePlaceholder({
      content: "{{editor_product_products}}",
      attr: { limit, category, columns, orderby: orderBy, order }
    })
};

const resizerPoints = ["centerLeft", "centerRight"];

export default class WOOPages extends EditorComponent {
  static defaultValue = defaultValue;
  state = {
    taxonomies: []
  };
  containerRef = React.createRef();

  static get componentId() {
    return "WOOPages";
  }

  componentDidMount() {
    getTerms("product_cat", this.getGlobalConfig()).then((taxonomies) =>
      this.setState({ taxonomies })
    );
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  handleDynamicContentSuccess = () => {
    const v = this.getValue();

    if (v.shortcode === "product") {
      const gallery = this.containerRef.current?.querySelector(
        ".woocommerce-product-gallery"
      );

      if (gallery) {
        jQuery(gallery).wc_product_gallery?.();
      }
    }
  };

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-woo-pages",
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

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarConfigFn(this.state.taxonomies),
          sidebarConfig
        )}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => {
                    attachRefs(el, [this.containerRef, toolbarRef, cssRef]);
                  }
                })}
              >
                <BoxResizer
                  points={resizerPoints}
                  value={v}
                  onChange={this.handleResizerChange}
                >
                  <DynamicContentHelper
                    placeholder={shortcodeToPlaceholder[v.shortcode]?.(v)}
                    tagName="div"
                    placeholderIcon="woo-2"
                    onSuccess={this.handleDynamicContentSuccess}
                    props={{ className: "brz-woo-page" }}
                  />
                </BoxResizer>
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}
