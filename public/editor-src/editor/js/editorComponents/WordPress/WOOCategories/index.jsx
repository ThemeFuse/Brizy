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

const resizerPoints = ["centerLeft", "centerRight"];

class WOOCategories extends EditorComponent {
  static get componentId() {
    return "WOOCategories";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const attributes = {
      number: v.number,
      orderby: v.orderBy,
      order: v.order,
      columns: v.columns,
      hide_empty: v.hideEmpty,
      parent: v.parent,
      ids: v.ids
    };

    const className = classnames(
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <WPShortcode
            name="product_categories"
            attributes={attributes}
            placeholderIcon="woo-2"
            className={className}
            resizerPoints={resizerPoints}
            resizerMeta={this.props.meta}
            resizerValue={v}
            resizerOnChange={this.handleResizerChange}
          />
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WOOCategories;
