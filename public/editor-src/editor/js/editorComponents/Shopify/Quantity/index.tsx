import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import { style } from "./styles";
import * as toolbar from "./toolbar";
import { Value } from "./types";

export class Quantity extends EditorComponent<Value> {
  static get componentId(): "Quantity" {
    return "Quantity";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value, vs: Value, vd: Value): React.ReactNode {
    const { customCSS, itemId } = v;
    const className = classnames(
      "brz-shopify-quantity",
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

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: makeDataAttr({
                name: "product-handle",
                value: itemId
              })
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
