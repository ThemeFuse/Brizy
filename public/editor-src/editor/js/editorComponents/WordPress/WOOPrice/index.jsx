import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import toolbarConfigFn from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

export default class WOOPrice extends EditorComponent {
  static get componentId() {
    return "WOOPrice";
  }

  static defaultValue = defaultValue;

  state = {
    hasDiscount: false
  };

  handleHTMLLoad = html => {
    this.setState({ hasDiscount: html.includes("<del>") });
  };

  renderForEdit(v, vs, vd) {
    const { hasDiscount } = this.state;
    const { className } = v;
    const classNameStyle = classnames(
      "brz-wooprice",
      className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const toolbarConfig = toolbarConfigFn(hasDiscount);

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <WPShortcode
          name='brizy_woo_field property="price"'
          placeholderIcon="wp-shortcode"
          className={classNameStyle}
          onLoadHTML={this.handleHTMLLoad}
        />
      </Toolbar>
    );
  }
}
