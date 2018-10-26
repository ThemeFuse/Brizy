import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";

const resizerPoints = ["centerLeft", "centerRight"];

class WOOCategories extends EditorComponent {
  static get componentId() {
    return "WOOCategories";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v) {
    const attributes = {
      number: v.number,
      orderby: v.orderBy,
      order: v.order,
      columns: v.columns,
      hide_empty: v.hideEmpty,
      parent: v.parent,
      ids: v.ids
    };

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <WPShortcode
          name="product_categories"
          attributes={attributes}
          placeholderIcon="woo-2"
          className={styleClassName(v)}
          style={styleCSSVars(v)}
          resizerPoints={resizerPoints}
          resizerMeta={this.props.meta}
          resizerValue={v}
          resizerOnChange={this.handleResizerChange}
        />
      </Toolbar>
    );
  }
}

export default WOOCategories;
