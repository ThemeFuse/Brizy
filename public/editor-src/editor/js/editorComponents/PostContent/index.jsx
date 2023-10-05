import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { css } from "visual/utils/cssStyle";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { getPlaceholder } from "./utils";

export default class WPPostContent extends EditorComponent {
  // NOTE: initially this element was for WordPress only.
  // After we needed to make it work for cloud as well, it was renamed,
  // but since we don't have a good migration system yet, the old componentId still remains
  static get componentId() {
    return "WPPostContent";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { sourceType, sourceID, className: className_ } = v;
    const className = classnames(
      "brz-wp-post-content",
      className_,
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
              placeholder={getPlaceholder(sourceType, sourceID)}
              placeholderIcon="wp-content"
              tagName="div"
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}
