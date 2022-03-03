import classnames from "classnames";
import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import CustomCSS from "visual/component/CustomCSS";
import { css } from "visual/utils/cssStyle";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as toolbar from "./toolbar";
import * as sidebar from "./sidebar";
import { style } from "./styles";
import { Value } from "./types";

export class Quantity extends EditorComponent<Value> {
  static get componentId(): "Quantity" {
    return "Quantity";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value, vs: Value, vd: Value): React.ReactNode {
    const className = classnames(
      "brz-shopify-quantity",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: { "data-product-handle": v.itemId }
            })}
          >
            <input
              className="brz-input"
              type="number"
              defaultValue={0}
              min="0"
              max="100"
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}
