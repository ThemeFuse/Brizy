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
import Config from "visual/global/Config";

class WPPostContent extends EditorComponent {
  static get componentId() {
    return "WPPostContent";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { className } = v;

    const classNameContent = classnames(
      "brz-wp__postContent",
      className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    const { isTemplate, page } = Config.get("wp");
    const attributes = {
      ...(IS_PREVIEW
        ? { post: "{{brizy_dc_post_id}}" }
        : !isTemplate
        ? { post: page }
        : {}),
      property: "post_content"
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <WPShortcode
            attributes={attributes}
            name="brizy_post_field"
            height={150}
            placeholderIcon="wp-shortcode"
            className={classNameContent}
          />
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WPPostContent;
