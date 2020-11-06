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
import { Wrapper } from "visual/editorComponents/tools/Wrapper";

class WOOExcerpt extends EditorComponent {
  static get componentId() {
    return "WOOExcerpt";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { className: className_ } = v;
    const className = classnames(
      "brz-wooexcerpt",
      className_,
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper {...this.makeWrapperProps({ className })}>
          <DynamicContentHelper
            placeholder="{{editor_product_short_description}}"
            placeholderIcon="wp-excerpt"
            tagName="div"
          />
        </Wrapper>
      </Toolbar>
    );
  }
}

export default WOOExcerpt;
