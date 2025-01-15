import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar, { hideToolbar } from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { isEditor } from "visual/providers/RenderProvider";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { t } from "visual/utils/i18n";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as sidebarProduct from "./sidebarProduct";
import * as sidebarSidebarSettings from "./sidebarSettings";
import { style } from "./styles";
import * as toolbar from "./toolbar";
import * as toolbarProductButton from "./toolbarProductButton";
import * as toolbarProductName from "./toolbarProductName";
import * as toolbarProductPrice from "./toolbarProductPrice";
import * as toolbarProductSubtotal from "./toolbarProductSubtotal";
import * as toolbarSidebarSettings from "./toolbarSidebarSettings";

export default class WOOCart extends EditorComponent {
  static get componentId() {
    return "WOOCart";
  }

  static defaultValue = defaultValue;

  state = {
    sidebarOpened: false
  };

  backgroundRef = React.createRef();

  dcRef = React.createRef();

  componentDidMount() {
    // a hack that stops click propagation on the backdrop
    // so that it does not reach to the Toolbars with selectors
    // that are situated beneath it and would open otherwise
    this.backgroundRef.current?.addEventListener("click", (e) =>
      e.stopPropagation()
    );
  }

  handleValueChange(patch, meta) {
    const { sidebar, tabletSidebar, mobileSidebar, ...rest } = patch;

    // detect if sidebar needs to be open
    if (
      sidebar === "open" ||
      tabletSidebar === "open" ||
      mobileSidebar === "open"
    ) {
      hideToolbar();
      this.setState({ sidebarOpened: true }, () => {
        super.handleValueChange(rest, meta);
      });
    } else {
      super.handleValueChange(patch, meta);
    }
  }

  handleDCSuccess = () => {
    // closes the sidebar when the user clicks the X icon
    this.dcRef.current?.addEventListener("click", (e) => {
      if (e.target.classList.contains("brz-woocart__sidebar-close")) {
        this.setState({ sidebarOpened: false });
      }
    });
  };

  renderForEdit(v, vs, vd) {
    const id = this.getId();
    const { className: className_, purchasesType } = v;

    const className = classnames(
      "brz-woocart__wrapper",
      {
        "brz-woocart__wrapper--opened": this.state.sidebarOpened
      },

      // Inside DC there is also an element with `brz-woocart__parent` class
      // but it's unclear if this was done on purpose or not
      "brz-woocart__parent",
      `brz-woocart--${purchasesType}`,
      className_,
      this.css(
        this.getComponentId(),
        id,
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
      content: "{{editor_product_cart}}"
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}
        selector=".brz-a.brz-woocart, .brz-shortcode__placeholder"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarProductName,
            sidebarProduct,
            {
              allowExtend: false
            }
          )}
          selector=".brz-woocart__sidebar__product-name"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(
              toolbarProductPrice,
              sidebarProduct,
              {
                allowExtend: false
              }
            )}
            selector=".brz-woocart__sidebar__product-price__container"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarProductSubtotal,
                sidebarProduct,
                {
                  allowExtend: false
                }
              )}
              selector=".brz-woocart__sidebar-subtotal"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(
                  toolbarProductButton,
                  sidebarProduct,
                  {
                    allowExtend: false
                  }
                )}
                selector=".brz-woocart__sidebar-buttons"
              >
                <CustomCSS selectorName={this.getId()} css={v.customCSS}>
                  <Wrapper
                    {...this.makeWrapperProps({
                      className,
                      attributes: { id: id }
                    })}
                  >
                    {isEditor(this.renderContext) && (
                      <Toolbar
                        {...this.makeToolbarPropsFromConfig2(
                          toolbarSidebarSettings,
                          sidebarSidebarSettings,
                          {
                            allowExtend: false
                          }
                        )}
                      >
                        <div className="brz-woocart__sidebar-toolbar">
                          {t("Cart Settings")}
                        </div>
                      </Toolbar>
                    )}
                    <div
                      className="brz-woocart__background"
                      ref={this.backgroundRef}
                    />
                    <DynamicContentHelper
                      placeholder={placeholder}
                      placeholderIcon="woo-cart"
                      tagName="div"
                      props={{ className: "brz-woocart__dc", ref: this.dcRef }}
                      onSuccess={this.handleDCSuccess}
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
