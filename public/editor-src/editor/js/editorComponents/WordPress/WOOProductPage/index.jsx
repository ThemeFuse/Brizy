import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { attachRefs } from "visual/utils/react";
import { WPShortcode } from "../common/WPShortcode";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = ["centerLeft", "centerRight"];

class WOOProductPage extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "WOOProductPage";
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const attributes = {
      id: v.productID
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
                name="brizy_product_page"
                attributes={attributes}
                placeholderIcon="woo-2"
                className={className}
                resizerPoints={resizerPoints}
                resizerMeta={this.props.meta}
                resizerValue={v}
                resizerOnChange={this.handleResizerChange}
                renderContext={this.props.renderContext}
                config={this.getGlobalConfig()}
                contentRef={(el) => attachRefs(el, [toolbarRef, cssRef])}
              />
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}

export default WOOProductPage;
