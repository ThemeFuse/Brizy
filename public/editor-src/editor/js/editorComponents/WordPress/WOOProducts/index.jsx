import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { getTerms } from "visual/utils/api";
import { attachRefs } from "visual/utils/react";
import { WPShortcode } from "../common/WPShortcode";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import toolbarConfigFn from "./toolbar";

const resizerPoints = ["centerLeft", "centerRight"];

class WOOProducts extends EditorComponent {
  static defaultValue = defaultValue;
  state = {
    taxonomies: []
  };

  static get componentId() {
    return "WOOProducts";
  }

  componentDidMount() {
    getTerms("product_cat", this.getGlobalConfig()).then((taxonomies) =>
      this.setState({ taxonomies })
    );
  }

  handleResizerChange = (patch) => this.patchValue(patch);

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
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
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
                renderContext={this.props.renderContext}
                config={this.getGlobalConfig()}
                containerRef={(el) => attachRefs(el, [toolbarRef, cssRef])}
              />
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}

export default WOOProducts;
