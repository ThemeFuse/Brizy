import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";

export default class WOOStock extends EditorComponent {
  static get componentId() {
    return "WOOStock";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const { className: className_ } = v;
    const className = classnames(
      "brz-woo-stock",
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
        <div className={className}>
          <DynamicContentHelper
            placeholder="{{brizy_woo_stock}}"
            tagName="div"
          />
        </div>
      </Toolbar>
    );
  }
}
