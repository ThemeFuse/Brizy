import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export class RechargeSubscriptions extends EditorComponent<ElementModel> {
  static get componentId(): "RechargeSubscriptions" {
    return "RechargeSubscriptions";
  }

  static defaultValue = defaultValue;
  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-recharge-subscriptions"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(): ReactNode {
    return (
      <Wrapper
        {...this.makeWrapperProps({
          className: "brz-shopify-recharge-subscriptions"
        })}
      >
        <div {...makeDataAttr({ name: "pf-type", value: "ReCharge" })}>
          {"{% render 'subscription-product' with product as product %}"}
        </div>
      </Wrapper>
    );
  }
}
