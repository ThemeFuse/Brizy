import classNames from "classnames";
import React, { ReactNode } from "react";
import { uniqueId } from "underscore";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { EcwidService } from "visual/libs/Ecwid";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as sidebarParent from "./sidebar";
import * as sidebarIcon from "./sidebarIcon";
import { style } from "./styles";
import * as toolbarParent from "./toolbar";
import * as toolbarIcon from "./toolbarIcon";

export interface Value extends ElementModel {
  productId: string;
  customCSS: string;
}

export class EcwidShoppingBag extends EditorComponent<Value> {
  static get componentId(): "EcwidShoppingBag" {
    return "EcwidShoppingBag";
  }

  static defaultValue = defaultValue;

  private uniqueId = `${EcwidShoppingBag.componentId}-${uniqueId()}`;

  componentDidMount(): void {
    if (!IS_EDITOR) {
      return;
    }

    const config = Config.getAll();

    if (isCloud(config) && config.modules?.shop?.type === "ecwid") {
      EcwidService.init(config.modules.shop.storeId, {}).shoppingCart();
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): React.ReactNode {
    const { customCSS } = v;

    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-shopping-bag-wrapper",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarParent, sidebarParent)}
      >
        {({ open: openBag }) => {
          return (
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(toolbarIcon, sidebarIcon)}
              selector=".brz-ecwid-shopping-bag-wrapper .ec-minicart__counter"
            >
              {({ open: openCounter }) => {
                return (
                  <CustomCSS selectorName={this.getId()} css={customCSS}>
                    <Wrapper {...this.makeWrapperProps({ className })}>
                      <div
                        onClickCapture={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          if (
                            (e.target as HTMLElement | null)?.closest(
                              ".brz-ecwid-shopping-bag-wrapper .ec-minicart__icon"
                            )
                          ) {
                            openBag(e.nativeEvent);
                          } else if (
                            (e.target as HTMLElement | null)?.closest(
                              ".brz-ecwid-shopping-bag-wrapper .ec-minicart__counter"
                            )
                          ) {
                            openCounter(e.nativeEvent);
                          }

                          return false;
                        }}
                        className={classNames(
                          "ec-cart-widget",
                          "brz-ecwid-shopping-bag"
                        )}
                        id={this.uniqueId}
                      />
                    </Wrapper>
                  </CustomCSS>
                );
              }}
            </Toolbar>
          );
        }}
      </Toolbar>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-shopping-bag-wrapper",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Wrapper {...this.makeWrapperProps({ className })}>
        <div
          className={classNames("ec-cart-widget", "brz-ecwid-shopping-bag")}
          data-store-id="{{ecwid_store_id}}"
        />
      </Wrapper>
    );
  }
}
