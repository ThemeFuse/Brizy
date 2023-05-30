import classnames from "classnames";
import React from "react";
import { useContent } from "widget/Shopify/Price/utils";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ConfigCommon";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendParent from "./sidebarExtendParent";
import * as sidebarExtendPrice from "./sidebarExtendPrice";
import * as sidebarExtendThroughPrice from "./sidebarExtendThroughPrice";
import { style } from "./styles";
import * as toolbarExtendParent from "./toolbarExtendParent";
import * as toolbarExtendPrice from "./toolbarExtendPrice";
import * as toolbarExtendThroughPrice from "./toolbarExtendThroughPrice";
import { Value } from "./types";

export class Price extends EditorComponent<Value> {
  static get componentId(): ElementTypes.Price {
    return ElementTypes.Price;
  }

  static defaultValue = defaultValue;

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  renderForEdit(v: Value, vs: Value, vd: Value) {
    const { customCSS, priceStyle, sourceID, sourceType } = v;

    const className = classnames(
      "brz-shopify-price-container",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    const toolbarPriceSelector =
      ".brz-shopify-price-container .brz-shortcode__placeholder, .brz-shopify-price-container .brz-shopify-price-style1";

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          toolbarExtendThroughPrice,
          sidebarExtendThroughPrice,
          {allowExtend: false}
        )}
        selector={".brz-shopify-price-container .brz-shopify-price-style2"}
      >
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarExtendPrice,
            sidebarExtendPrice,
            { allowExtend: false }
          )}
          selector={toolbarPriceSelector}
        >
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <Wrapper
              {...this.makeWrapperProps({
                className
              })}
            >
              {useContent(priceStyle, sourceID, sourceType)}
            </Wrapper>
          </CustomCSS>
        </Toolbar>
      </Toolbar>
    );
  }
}
