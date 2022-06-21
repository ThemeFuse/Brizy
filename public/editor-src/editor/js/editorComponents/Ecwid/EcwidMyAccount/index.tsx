import React, { createRef, ReactNode } from "react";
import classNames from "classnames";
import { uniqueId } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { EcwidService } from "visual/libs/Ecwid";
import CustomCSS from "visual/component/CustomCSS";
import { css } from "visual/utils/cssStyle";

import { style } from "./styles";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendParent from "./sidebar";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarExtendFooter from "./toolbarFooter";
import * as toolbarExtendTitle from "./toolbarTitle";
import * as toolbarExtendDescription from "./toolbarDescription";
import * as toolbarExtendInput from "./toolbarInput";
import * as toolbarExtendAgreement from "./toolbarAgreement";

export interface Value extends ElementModel {
  productId: string;

  customCSS: string;
}

export class EcwidMyAccount extends EditorComponent<Value> {
  private uniqueId = `${EcwidMyAccount.componentId}-${uniqueId()}`;

  private containerRef = createRef<HTMLDivElement>();

  static get componentId(): "EcwidMyAccount" {
    return "EcwidMyAccount";
  }
  static defaultValue = defaultValue;

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);

    if (!IS_EDITOR) {
      return;
    }

    const config = Config.getAll();

    if (
      this.containerRef.current &&
      isCloud(config) &&
      config.modules?.shop?.type === "ecwid"
    ) {
      EcwidService.init(config.modules.shop.storeId).myAccount(
        this.containerRef.current
      );
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): React.ReactNode {
    const { customCSS } = v;

    const className = classNames(
      "brz-ecwid-wrapper",
      "brz-ecwid-my-account-wrapper",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarExtendTitle)}
        selector=".page-title__name.ec-header-h1, h3.page-title__name.ec-header-h4"
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarExtendDescription)}
          selector=".ec-cart-email__text"
        >
          <Toolbar
            {...this.makeToolbarPropsFromConfig2(toolbarExtendInput)}
            selector=".ec-cart-email__input"
          >
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(toolbarExtendAgreement)}
              selector=".ec-cart__agreement"
            >
              <Toolbar
                {...this.makeToolbarPropsFromConfig2(toolbarExtendFooter)}
                selector=".ec-footer"
              >
                <CustomCSS selectorName={this.getId()} css={customCSS}>
                  <Wrapper {...this.makeWrapperProps({ className })}>
                    <div
                      className="brz-ecwid-my-account"
                      id={this.uniqueId}
                      ref={this.containerRef}
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

  renderForView(): ReactNode {
    return (
      <Wrapper {...this.makeWrapperProps({})}>
        <div
          className="brz-ecwid-my-account"
          data-store-id="{{ecwid_store_id}}"
        />
      </Wrapper>
    );
  }
}
