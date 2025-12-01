import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import { style } from "./styles";
import * as toolbar from "./toolbar";
import { Value } from "./types";

export class Quantity extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.Quantity {
    return ElementTypes.Quantity;
  }

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
          contexts: this.getContexts()
        })
      )
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  attributes: makeDataAttr({
                    name: "product-handle",
                    value: itemId
                  }),
                  ref: (el) => attachRefs(el, [toolbarRef, cssRef])
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
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}
