import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

class WPPostInfo extends EditorComponent {
  static get componentId() {
    return "WPPostInfo";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { className, postElements } = v;

    const elements = element =>
      JSON.parse(postElements).some(el => el === element);

    const classNameBC = classnames(
      "brz-wp__postinfo",
      { "brz-wp__postinfo__column": v.large === "column" },
      { "brz-wp__postinfo__disabled-author": !elements("author") },
      { "brz-wp__postinfo__disabled-date": !elements("date") },
      { "brz-wp__postinfo__disabled-time": !elements("time") },
      { "brz-wp__postinfo__disabled-comments": !elements("comments") },
      className,
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
          <WPShortcode
            blocked={false}
            name="brizy_post_info"
            height={45}
            placeholderIcon="wp-shortcode"
            className={classNameBC}
          />
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WPPostInfo;
