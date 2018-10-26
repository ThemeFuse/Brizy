import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";

const resizerPoints = ["centerLeft", "centerRight"];

class WPCustomShortcode extends EditorComponent {
  static get componentId() {
    return "WPCustomShortcode";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v) {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <WPShortcode
          raw={v.shortcode}
          placeholderIcon="wp-shortcode"
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

export default WPCustomShortcode;
