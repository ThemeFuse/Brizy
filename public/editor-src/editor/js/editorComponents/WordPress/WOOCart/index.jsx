import React from "react";
import { t } from "visual/utils/i18n";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import * as toolbarConfigParrent from "./toolbarExtendParent";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as toolbarSidebarConfig from "./toolbarSidebar";
import Toolbar from "visual/component/Toolbar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { defaultValueValue } from "visual/utils/onChange";
import { deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Wrapper } from "../../tools/Wrapper";
import CustomCSS from "visual/component/CustomCSS";

export default class WOOCart extends EditorComponent {
  static get componentId() {
    return "WOOCart";
  }

  static defaultValue = defaultValue;

  state = {
    renderHTML: false
  };

  handleClose = id => {
    const cartElement = document.getElementById(id);

    const backgroundActive = "brz-woocart__background--active";
    const sidebarActive = "brz-woocart__sidebar--active";
    const toolbarActive = "brz-woo-cart-sidebar--open";

    if (cartElement) {
      const background = cartElement.querySelector(".brz-woocart__background");
      const sidebar = cartElement.querySelector(".brz-woocart__sidebar");
      const sidebarClose = cartElement.querySelector(
        ".brz-woocart__sidebar-close"
      );
      const toolbar = cartElement.querySelector(
        ".brz-woocart__sidebar-toolbar"
      );
      const sidebarClosed =
        !background?.classList.contains(backgroundActive) &&
        !sidebar?.classList.contains(sidebarActive);

      const listner = () => {
        background?.classList.remove(backgroundActive);
        sidebar?.classList.remove(sidebarActive);
        toolbar?.classList.remove(toolbarActive);
        this.patchValue({
          sidebar: "close",
          tabletSidebar: "close",
          mobileSidebar: "close"
        });

        sidebarClose?.removeEventListener("click", listner);
      };

      if (cartElement) {
        if (sidebarClosed) {
          background?.classList.add(backgroundActive);
          sidebar?.classList.add(sidebarActive);
          toolbar?.classList.add(toolbarActive);
        }
      }
      sidebarClose?.addEventListener("click", listner);
    }
  };

  componentDidUpdate() {
    const v = this.getValue();
    const id = this.getId();
    const sidebar = defaultValueValue({
      v,
      key: "sidebar",
      device: deviceModeSelector(getStore().getState()),
      state: "normal"
    });

    if (sidebar === "open" && IS_EDITOR) {
      this.handleClose(id);
    }
  }

  renderForEdit(v, vs, vd) {
    const cartId = this.getId();
    const { className: className_, purchasesType } = v;
    const className = classnames(
      "brz-woocart__wrapper",
      // Inside DC there is also an element with `brz-woocart__parent` class
      // but it's unclear if this was done on purpose or not
      "brz-woocart__parent",
      `brz-woocart--${purchasesType}`,
      className_,
      css(this.constructor.componentId, cartId, style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarConfigParrent,
          sidebarExtendParent
        )}
        selector=".brz-a.brz-woocart, .brz-shortcode__placeholder"
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: { id: cartId }
            })}
          >
            {IS_EDITOR && (
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(toolbarSidebarConfig)}
              >
                <div className="brz-woocart__sidebar-toolbar">
                  {t("Cart Settings")}
                </div>
              </Toolbar>
            )}
            <div className="brz-woocart__background" />
            <DynamicContentHelper
              placeholder="{{editor_product_cart}}"
              placeholderIcon="woo-cart"
              tagName="div"
              props={{ className: "brz-woocart__dc" }}
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}
