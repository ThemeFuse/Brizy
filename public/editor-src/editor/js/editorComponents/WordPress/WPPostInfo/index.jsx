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

class WPPostInfo extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "WPPostInfo";
  }

  renderForEdit(v, vs, vd) {
    const { className, postElements } = v;

    const elements = (element) =>
      JSON.parse(postElements).some((el) => el === element);

    const classNameBC = classnames(
      "brz-wp__postinfo",
      { "brz-wp__postinfo__column": v.large === "column" },
      { "brz-wp__postinfo__disabled-author": !elements("author") },
      { "brz-wp__postinfo__disabled-date": !elements("date") },
      { "brz-wp__postinfo__disabled-time": !elements("time") },
      { "brz-wp__postinfo__disabled-comments": !elements("comments") },
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
      content: "{{editor_post_info}}"
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
                  placeholderIcon="wp-post-info"
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

export default WPPostInfo;
