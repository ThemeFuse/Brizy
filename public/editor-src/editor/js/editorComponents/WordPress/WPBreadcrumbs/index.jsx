import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

class WPBreadcrumbs extends EditorComponent {
  static get componentId() {
    return "WPBreadcrumbs";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { className } = v;

    const classNameBC = classnames(
      "brz-wp__sidebar",
      className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <WPShortcode
            blocked={false}
            name="brizy_breadcrumbs"
            placeholderIcon="wp-shortcode"
            className={classNameBC}
          />
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WPBreadcrumbs;
