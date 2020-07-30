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

class WOOProductMeta extends EditorComponent {
  static get componentId() {
    return "WOOProductMeta";
  }

  static defaultValue = defaultValue;

  renderForEdit(v, vs, vd) {
    const attributes = {
      id: v.productID,
      style: v.style
    };

    const className = classnames(
      "brz-wooproductmeta",
      { "brz-wooproductmeta-table": v.elementType === "table" },
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
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <WPShortcode
            name='brizy_woo_field property="metas"'
            attributes={attributes}
            placeholderIcon="woo-2"
            className={className}
          />
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WOOProductMeta;
