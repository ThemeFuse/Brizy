import React from "react";
import jQuery from "jquery";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { DynamicContentHelper } from "../common/DynamicContentHelper";
import { getTerms } from "visual/utils/api";
import toolbarConfigFn from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";

// NOTE: woocommerce_* because of backwards compatibility
const shortcodeToPlaceholder = {
  woocommerce_cart: () => "{{editor_product_default_cart}}",
  woocommerce_checkout: () => "{{editor_product_checkout}}",
  woocommerce_my_account: () => "{{editor_product_my_account}}",
  woocommerce_order_tracking: () => "{{editor_product_order_tracking}}",
  product: ({ productID }) => `{{editor_product_page id="${productID}"}}`,
  products: ({ limit, category, columns, orderBy, order }) =>
    `{{editor_product_products limit="${limit}" category="${category}" columns="${columns}" orderby="${orderBy}" order="${order}"}}`
};

const resizerPoints = ["centerLeft", "centerRight"];

export default class WOOPages extends EditorComponent {
  static get componentId() {
    return "WOOPages";
  }

  static defaultValue = defaultValue;

  state = {
    taxonomies: []
  };

  componentDidMount() {
    getTerms("product_cat").then(taxonomies => this.setState({ taxonomies }));
  }

  containerRef = React.createRef();

  handleResizerChange = patch => this.patchValue(patch);

  handleDynamicContentSuccess = () => {
    const v = this.getValue();

    if (v.shortcode === "product") {
      const gallery = this.containerRef.current?.querySelector(
        ".woocommerce-product-gallery"
      );

      if (gallery) {
        jQuery(gallery).wc_product_gallery();
      }
    }
  };

  renderForEdit(v, vs, vd) {
    const className = classnames(
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarConfigFn(this.state.taxonomies),
          sidebarConfig
        )}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({ className, ref: this.containerRef })}
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
              />
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}
