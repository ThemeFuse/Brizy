import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

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
    const placeholder = makePlaceholder({
      content: "{{editor_product_rating}}"
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <DynamicContentHelper
              placeholder={placeholder}
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
