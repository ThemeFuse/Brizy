import classnames from "classnames";
import React from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { makePlaceholder } from "visual/utils/dynamicContent";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

class WOOExcerpt extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "WOOExcerpt";
  }

  renderForEdit(v, vs, vd) {
    const { className: className_ } = v;
    const className = classnames(
      "brz-wooexcerpt",
      className_,
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
    const placeholder = makePlaceholder({
      content: "{{editor_product_short_description}}"
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref }) => (
          <Wrapper {...this.makeWrapperProps({ className, ref })}>
            <DynamicContentHelper
              placeholder={placeholder}
              placeholderIcon="wp-excerpt"
              tagName="div"
            />
          </Wrapper>
        )}
      </Toolbar>
    );
  }
}

export default WOOExcerpt;
