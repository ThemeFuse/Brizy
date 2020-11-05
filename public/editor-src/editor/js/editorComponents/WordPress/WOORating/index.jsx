import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "../../tools/Wrapper";
import CustomCSS from "visual/component/CustomCSS";

export default class WOORating extends EditorComponent {
  static get componentId() {
    return "WOORating";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-woo-rating",
      { "brz-disabled-rating-text": v.text === "off" },
      v.className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <DynamicContentHelper
              placeholder="{{editor_product_rating}}"
              placeholderIcon="woo-rating"
              tagName="div"
              blocked={false}
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}
