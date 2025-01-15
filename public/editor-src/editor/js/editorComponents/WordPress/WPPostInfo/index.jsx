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

class WPPostInfo extends EditorComponent {
  static get componentId() {
    return "WPPostInfo";
  }

  static defaultValue = defaultValue;

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
          renderContext: this.renderContext
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
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className: classNameBC })}>
            <DynamicContentHelper
              placeholder={placeholder}
              placeholderIcon="wp-post-info"
              tagName="div"
              blocked={false}
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WPPostInfo;
