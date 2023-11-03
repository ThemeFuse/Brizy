import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import PortalToolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import { getItems as sidebar } from "./sidebar";
import { style } from "./styles";
import { getItems as toolbar } from "./toolbar";

export interface Value extends ElementModel {
  itemId: string;
}

export class Variations extends EditorComponent<Value> {
  static get componentId(): "Variations" {
    return "Variations";
  }

  static defaultValue = defaultValue;

  handleTextChange = (patch: Value): void => this.patchValue(patch);

  renderForEdit(v: Value, vs: Value, vd: Value): React.ReactNode {
    const { itemId, customCSS } = v;
    const className = classnames(
      "brz-shopify-variations",
      css(this.getId(), this.getId(), style(v, vs, vd))
    );

    const productHandleDataFromAttr = makeDataAttr({
      name: "product-handle",
      value: itemId
    });

    return (
      <PortalToolbar
        {...this.makeToolbarPropsFromConfig2(
          { getItems: toolbar },
          { getItems: sidebar }
        )}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: productHandleDataFromAttr
            })}
          >
            <div>
              <input type="radio" {...productHandleDataFromAttr} value={0} /> S
            </div>
            <div>
              <input type="radio" {...productHandleDataFromAttr} value={1} /> M
            </div>
            <div>
              <input type="radio" {...productHandleDataFromAttr} value={2} /> L
            </div>
          </Wrapper>
        </CustomCSS>
      </PortalToolbar>
    );
  }
}
