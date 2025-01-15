import classnames from "classnames";
import React, { JSX } from "react";
import { isEditor } from "visual/providers/RenderProvider";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import type { ElementProps } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Button } from "./controls/Button";
import { InputCommon } from "./controls/InputCommon";
import { InputsPayment } from "./controls/InputsPayment";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import type { Value } from "./types";

class Paypal extends EditorComponent<Value, ElementProps> {
  static get componentId(): ElementTypes.Paypal {
    return ElementTypes.Paypal;
  }

  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  handleTextChange = (patch: Partial<Value>): void => this.patchValue(patch);

  renderPaypal(
    v: Value,
    vs: Value,
    vd: Value,
    extraClassName?: string
  ): JSX.Element {
    const {
      activeSandbox,
      openInNewTab,
      customCSS,
      type,
      account,
      name,
      sku,
      currency,
      redirect,
      iconName,
      iconType,
      rate,
      price,
      shippingPrice,
      tax,
      quantity,
      billingCycle,
      billingCycleDuration,
      autoRenewal,
      donationAmount,
      amount
    } = v;

    const className = classnames(
      "brz-paypal",
      extraClassName,
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

    const url =
      activeSandbox === "on"
        ? "https://www.sandbox.paypal.com/cgi-bin/webscr"
        : "https://www.paypal.com/cgi-bin/webscr";

    const target = openInNewTab === "on" ? "_blank" : "_top";
    const buttonType =
      account === "" || isEditor(this.renderContext) ? "button" : "submit";

    const _tax = tax === "none" ? 0 : rate;
    const _donationAmount = donationAmount === "anyAmount" ? 0 : amount;
    const _autoRenewal = autoRenewal === "on" ? 1 : 0;

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <form
              className="brz-paypal-form"
              action={url}
              method="POST"
              target={target}
            >
              <InputCommon
                type={type}
                account={account}
                name={name}
                sku={sku}
                currency={currency}
                redirect={redirect}
              />
              <InputsPayment
                type={type}
                donationAmount={_donationAmount}
                price={price}
                billingCycle={billingCycle}
                billingCycleDuration={billingCycleDuration}
                autoRenewal={_autoRenewal}
                shippingPrice={shippingPrice}
                tax={_tax}
                quantity={quantity}
              />
              <Button
                iconName={iconName}
                iconType={iconType}
                buttonType={buttonType}
              >
                <Text
                  className="brz-paypal-text"
                  id="text"
                  v={v}
                  onChange={this.handleTextChange}
                />
              </Button>
            </form>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForEdit(v: Value, vs: Value, vd: Value): JSX.Element {
    return this.renderPaypal(v, vs, vd);
  }

  renderForView(v: Value, vs: Value, vd: Value): JSX.Element {
    const className = v.account === "" ? "brz-paypal--disabled" : "";

    return this.renderPaypal(v, vs, vd, className);
  }
}

export default Paypal;
