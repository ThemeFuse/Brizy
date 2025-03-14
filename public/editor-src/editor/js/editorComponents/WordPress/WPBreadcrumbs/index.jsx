import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

class WPBreadcrumbs extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "WPBreadcrumbs";
  }

  renderForEdit(v, vs, vd) {
    const { className } = v;

    const classNameBC = classnames(
      "brz-wp__breadcrumbs",
      className,
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
      content: "{{editor_breadcrumbs}}"
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className: classNameBC,
                  ref: (el) => attachRefs(el, [toolbarRef, cssRef])
                })}
              >
                <DynamicContentHelper
                  placeholder={placeholder}
                  placeholderIcon="wp-breadcrumbs"
                  tagName="div"
                  blocked={false}
                />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}

export default WPBreadcrumbs;
