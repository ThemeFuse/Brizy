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

export default class WOOAdditional extends EditorComponent {
  static get componentId() {
    return "WOOAdditional";
  }

  static defaultValue = defaultValue;

  state = {};

  renderForEdit(v, vs, vd) {
    const attributes = {};

    const { className } = v;

    const classNameStyle = classnames(
      "brz-wooadditional",
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
          name='brizy_woo_field property="additional-information"'
          attributes={attributes}
          placeholderIcon="wp-shortcode"
          placeholderContainerWidth={this.props.meta.desktopW}
          className={classNameStyle}
        />
      </Toolbar>
    );
  }
}
