import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import {
  makeAttr,
  makeDataAttr
} from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export interface Value extends ElementModel {
  buttonType: string;
  buttonName: string;
  subMessage: string;
  preDisplay: string;
  postDisplay: string;
}

export class PushOwlNotifications extends EditorComponent<Value> {
  static get componentId(): "PushOwlNotifications" {
    return "PushOwlNotifications";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value): ReactNode {
    const { buttonType, buttonName, subMessage, preDisplay, postDisplay } = v;

    const className =
      buttonType === "subscribe"
        ? "js-pushowl--subscribe"
        : buttonType === "bis"
        ? "js-pushowl--bis"
        : "js-pushowl--pd";

    const attr: Record<string, string> = {
      [`${makeAttr("product-id")}`]: makePlaceholder({ content: "{{ product.id }}" })
    };

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-owl-notifications"
          })}
        >
          {IS_PREVIEW ? (
            <button
              type="button"
              className={className}
              {...makeDataAttr({
                name: "pushowl-post-subscription-message",
                value: subMessage.trim()
              })}
              {...makeDataAttr({
                name: "pushowl-pre-display",
                value: preDisplay
              })}
              {...makeDataAttr({
                name: "pushowl-post-display",
                value: postDisplay
              })}
              {...makeDataAttr({ name: "pf-type", value: "PushOwl" })}
              {...(buttonType !== "subscribe" ? attr : "")}
            >
              {buttonName.trim()}
            </button>
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
