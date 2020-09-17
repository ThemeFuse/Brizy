import React from "react";
import jQuery from "jquery";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import * as toolbarThumbnail from "./toolbarThumbnail";
import * as sidebarThumbnail from "./sidebarThumbnail";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "../../tools/Wrapper";

export default class WOOGallery extends EditorComponent {
  static get componentId() {
    return "WOOGallery";
  }

  static defaultValue = defaultValue;

  containerRef = React.createRef();

  onDynamicContentSuccess = () => {
    const gallery = this.containerRef.current?.querySelector(
      ".woocommerce-product-gallery"
    );

    if (gallery) {
      // NOTE: It's kept commented because of the peculiar way in which
      // wc's wc_product_gallery plugin is configured
      // (it relies on there being a global variable instead of reading the config from args)

      // global.wc_single_product_params = {
      //   flexslider_enabled: true,
      //   flexslider: {
      //     rtl: false,
      //     animation: "slide",
      //     smoothHeight: true,
      //     directionNav: false,
      //     controlNav: "thumbnails",
      //     slideshow: false,
      //     animationSpeed: 500,
      //     animationLoop: false,
      //     allowOneSlide: false
      //   },

      //   zoom_enabled: true,
      //   zoom_options: [],

      //   photoswipe_enabled: true,
      //   photoswipe_options: {
      //     shareEl: false,
      //     closeOnScroll: false,
      //     history: false,
      //     hideAnimationDuration: 0,
      //     showAnimationDuration: 0
      //   }
      // };

      jQuery(gallery).wc_product_gallery();
    }
  };

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-woo-gallery",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        selector=".woocommerce-product-gallery__image, .brz-shortcode__placeholder"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarThumbnail,
            sidebarThumbnail,
            { allowExtend: false }
          )}
          selector=".flex-control-thumbs"
        >
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            <Wrapper
              {...this.makeWrapperProps({ className, ref: this.containerRef })}
            >
              <DynamicContentHelper
                placeholder="{{editor_product_gallery}}"
                placeholderIcon="woo-gallery"
                placeholderHeight={250}
                tagName="div"
                onSuccess={this.onDynamicContentSuccess}
              />
            </Wrapper>
          </CustomCSS>
        </Toolbar>
      </Toolbar>
    );
  }
}
