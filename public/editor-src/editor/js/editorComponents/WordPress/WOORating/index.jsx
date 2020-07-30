import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

class WOORating extends EditorComponent {
  static get componentId() {
    return "WOORating";
  }

  static defaultValue = defaultValue;

  state = {};

  renderForEdit(v, vs, vd) {
    const attributes = {};

    const classNameStyle = classnames(
      "brz-woorating",
      v.className,
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
          blocked={false}
          name='brizy_woo_field property="rating"'
          attributes={attributes}
          placeholderIcon="wp-shortcode"
          placeholderContainerWidth={this.props.meta.desktopW}
          className={classNameStyle}
        />
      </Toolbar>
    );
  }
}

export default WOORating;
