import classnames from "classnames";
import { Quantity1 } from "component/Flex/Shopify/Quantity1";
import { Quantity2 } from "component/Flex/Shopify/Quantity2";
import React, { ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ConfigCommon";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendButton from "./sidebarExtendButton";
import * as sidebarExtendInput from "./sidebarExtendInput";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { style } from "./styles";
import * as toolbarExtendButton from "./toolbarExtendButton";
import * as toolbarExtendInput from "./toolbarExtendInput";
import * as toolbarExtendParent from "./toolbarExtendParent";
import { Value } from "./types";

export class Quantity extends EditorComponent<Value> {
  static get componentId(): ElementTypes.Quantity {
    return ElementTypes.Quantity;
  }

  static defaultValue = defaultValue;

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { customCSS, quantityStyle, sourceID } = v;
    const inputSelector =
      quantityStyle === "style-1"
        ? ".brz-shopify-quantity-style1 input"
        : ".brz-shopify-quantity-style2 input";

    const attr = {
      "data-product-handle": String(sourceID)
    };

    const buttonSelector = ".brz-shopify-quantity-style2 .brz-package__button";

    const className = classnames(
      "brz-shopify-quantity-container",
      css(`${this.getComponentId()}`, `${this.getId()}`, style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarExtendInput,
          sidebarExtendInput,
          {
            allowExtend: false
          }
        )}
        selector={inputSelector}
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarExtendButton,
            sidebarExtendButton,
            {
              allowExtend: false
            }
          )}
          selector={buttonSelector}
        >
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <Wrapper
              {...this.makeWrapperProps({
                className
              })}
            >
              {quantityStyle === "style-1" ? (
                <Quantity1 attr={attr} />
              ) : (
                <Quantity2 attr={attr} />
              )}
            </Wrapper>
          </CustomCSS>
        </Toolbar>
      </Toolbar>
    );
  }
}
