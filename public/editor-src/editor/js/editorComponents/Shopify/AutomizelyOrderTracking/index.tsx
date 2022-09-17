import React,{ReactNode} from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { hexToRgba } from "visual/utils/color";
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
            <div data-pf-type="Aftership">
              <div
                className="as-track-button"
                data-size={size}
                data-domain={domain}
                data-look-up-option={lookupOption}
                data-btn-label={buttonText}
                data-btn-bg-color={hexToRgba(
                  buttonColorHex,
                  buttonColorOpacity
                )}
                data-btn-text-color={hexToRgba(textColorHex, textColorOpacity)}
                data-hide-icon={hideIcon === "off" ? "false" : "true"}
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
