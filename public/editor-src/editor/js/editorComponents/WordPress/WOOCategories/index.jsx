import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = ["centerLeft", "centerRight"];

class WOOCategories extends EditorComponent {
  static get componentId() {
    return "WOOCategories";
  }

  static defaultValue = defaultValue;

  handleResizerChange = (patch) => this.patchValue(patch);

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
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
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
            renderContext={this.renderContext}
            config={this.getGlobalConfig()}
          />
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WOOCategories;
