import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import defaultValue from "./defaultValue.json";
import toolbarConfigFn from "./toolbar";
import * as sidebarConfig from "./sidebar";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { getTerms } from "visual/utils/api";

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
    getTerms("product_cat").then(taxonomies => this.setState({ taxonomies }));
  }

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const toolbarConfig = toolbarConfigFn(this.state.taxonomies);
    const attributes = {
      ids: v.ids,
      limit: v.limit,
      category: v.category,
      columns: v.columns,
      orderby: v.orderBy,
      order: v.order
    };
    const classNames = classnames(
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
            name="products"
            attributes={attributes}
            placeholderIcon="woo-2"
            placeholderContainerWidth={this.props.meta.desktopW}
            className={classNames}
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

export default WOOProducts;
