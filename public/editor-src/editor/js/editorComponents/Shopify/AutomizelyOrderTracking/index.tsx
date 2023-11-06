import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { hexToRgba } from "visual/utils/color";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export interface Value extends ElementModel {
  lookupOption: string;
  buttonText: string;
  domain: string;
  size: string;
  buttonColorHex: string;
  buttonColorOpacity: number;
  textColorHex: string;
  textColorOpacity: number;
  hideIcon: string;
}

export class AutomizelyOrderTracking extends EditorComponent<Value> {
  static get componentId(): "AutomizelyOrderTracking" {
    return "AutomizelyOrderTracking";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value): ReactNode {
    const {
      lookupOption,
      buttonText,
      domain,
      size,
      buttonColorHex,
      buttonColorOpacity,
      textColorHex,
      textColorOpacity,
      hideIcon
    } = v;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-automizely-order-tracking"
          })}
        >
          {IS_PREVIEW ? (
            <div {...makeDataAttr({ name: "pf-type", value: "Aftership" })}>
              <div
                className="as-track-button"
                {...makeDataAttr({ name: "size", value: size })}
                {...makeDataAttr({ name: "domain", value: domain })}
                {...makeDataAttr({
                  name: "look-up-option",
                  value: lookupOption
                })}
                {...makeDataAttr({ name: "btn-label", value: buttonText })}
                {...makeDataAttr({
                  name: "btn-bg-color",
                  value: String(hexToRgba(buttonColorHex, buttonColorOpacity))
                })}
                {...makeDataAttr({
                  name: "btn-text-color",
                  value: String(hexToRgba(textColorHex, textColorOpacity))
                })}
                {...makeDataAttr({
                  name: "hide-icon",
                  value: hideIcon === "off" ? "false" : "true"
                })}
              />
            </div>
          ) : (
            <Placeholder icon="img" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
