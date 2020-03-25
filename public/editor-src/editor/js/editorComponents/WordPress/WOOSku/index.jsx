import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

class WOOSku extends EditorComponent {
  static get componentId() {
    return "WOOSku";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { className } = v;

    const classNameSku = classnames(
      "brz-woosku",
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
        <WPShortcode
          name="brizy_woo_sku"
          placeholderIcon="wp-shortcode"
          className={classNameSku}
        />
      </Toolbar>
    );
  }
}

export default WOOSku;
