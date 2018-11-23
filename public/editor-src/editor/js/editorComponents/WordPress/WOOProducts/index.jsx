import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import defaultValue from "./defaultValue.json";
import toolbarConfigFn from "./toolbar";
import { styleClassName, styleCSSVars } from "./styles";
import * as Api from "visual/utils/api/editor/index";

const resizerPoints = ["centerLeft", "centerRight"];

class WOOProducts extends EditorComponent {
  static get componentId() {
    return "WOOProducts";
  }

  static defaultValue = defaultValue;

  state = {
    taxonomies: []
  };

  componentDidMount() {
    Api.getTerms("product_cat").then(taxonomies =>
      this.setState({ taxonomies })
    );
  }

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v) {
    const toolbarConfig = toolbarConfigFn(this.state.taxonomies);
    const attributes = {
      ids: v.ids,
      limit: v.limit,
      category: v.category,
      columns: v.columns,
      orderby: v.orderBy,
      order: v.order
    };

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <WPShortcode
          name="products"
          attributes={attributes}
          placeholderIcon="woo-2"
          placeholderContainerWidth={this.props.meta.desktopW}
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

export default WOOProducts;
