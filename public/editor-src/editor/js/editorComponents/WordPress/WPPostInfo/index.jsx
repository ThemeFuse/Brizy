import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Config from "visual/global/Config";
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
    const { className } = v;

    const classNameBC = classnames(
      "brz-wp__postinfo",
      className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    const pageId = Config.get("wp").page;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <WPShortcode
            blocked={false}
            name="brizy_post_info"
            height={45}
            placeholderIcon="wp-shortcode"
            className={classNameBC}
            attributes={{ post: pageId }}
          />
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WPPostInfo;
