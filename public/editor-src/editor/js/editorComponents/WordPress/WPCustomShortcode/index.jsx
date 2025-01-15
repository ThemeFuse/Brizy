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

class WPCustomShortcode extends EditorComponent {
  static get componentId() {
    return "WPCustomShortcode";
  }

  static defaultValue = defaultValue;

  handleResizerChange = (patch) => this.patchValue(patch);

  handleValueChange(newValue, meta) {
    if (meta.patch.shortcode) {
      super.handleValueChange({ ...newValue, shortcode: newValue.shortcode });
    } else {
      super.handleValueChange(newValue, meta);
    }
  }

  renderForEdit(v, vs, vd) {
    const { className } = v;
    const classNameWP = classnames(
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
      ),
      className
    );
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <WPShortcode
            raw={v.shortcode}
            placeholderIcon="wp-custom-shortcode"
            className={classNameWP}
            height={45}
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

export default WPCustomShortcode;
