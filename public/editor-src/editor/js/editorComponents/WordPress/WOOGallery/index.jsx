import classnames from "classnames";
import jQuery from "jquery";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as sidebarThumbnail from "./sidebarThumbnail";
import { style } from "./styles";
import * as toolbar from "./toolbar";
import * as toolbarThumbnail from "./toolbarThumbnail";

const resizerPoints = ["centerLeft", "centerRight"];

export default class WOOGallery extends EditorComponent {
  static defaultValue = defaultValue;
  containerRef = React.createRef();

  static get componentId() {
    return "WOOGallery";
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  handleDynamicContentSuccess = () => {
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

      jQuery(gallery).wc_product_gallery?.();
    }
  };

  renderForEdit(v, vs, vd) {
    const classTopBottom = `brz-woo-gallery__thumbsTB-${v.thumbPerRowTB}`;
    const classRightLeft = `brz-woo-gallery__thumbsRL-${v.thumbPerRowRL}`;

    const isTopBottom = v.thumbStyle === "top" || v.thumbStyle === "bottom";

    const className = classnames(
      "brz-woo-gallery",
      `brz-woo-gallery__style-${v.thumbStyle}`,
      { [classTopBottom]: isTopBottom },
      { [classRightLeft]: !isTopBottom },
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

    const restrictions = {
      width: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      tabletWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      mobileWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      }
    };
    const placeholder = makePlaceholder({
      content: "{{editor_product_gallery}}"
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}
        selector=".woocommerce-product-gallery__image, .brz-shortcode__placeholder"
      >
        {({ ref: placeholderRef }) => (
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarThumbnail,
              sidebarThumbnail,
              { allowExtend: false }
            )}
            selector=".flex-control-thumbs"
          >
            {({ ref: thumbsRef }) => (
              <CustomCSS selectorName={this.getId()} css={v.customCSS}>
                {({ ref: cssRef }) => (
                  <Wrapper
                    {...this.makeWrapperProps({
                      className,
                      ref: (el) => {
                        attachRefs(el, [
                          this.containerRef,
                          placeholderRef,
                          thumbsRef,
                          cssRef
                        ]);
                      }
                    })}
                  >
                    <BoxResizer
                      points={resizerPoints}
                      meta={this.props.meta}
                      value={v}
                      onChange={this.handleResizerChange}
                      restrictions={restrictions}
                    >
                      <DynamicContentHelper
                        placeholder={placeholder}
                        placeholderIcon="woo-gallery"
                        placeholderHeight={250}
                        tagName="div"
                        onSuccess={this.handleDynamicContentSuccess}
                        blocked={false}
                      />
                    </BoxResizer>
                  </Wrapper>
                )}
              </CustomCSS>
            )}
          </Toolbar>
        )}
      </Toolbar>
    );
  }
}
