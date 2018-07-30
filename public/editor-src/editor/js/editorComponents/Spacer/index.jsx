import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import BoxResizer from "visual/component-new/BoxResizer";
import Toolbar from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import { styleClassName, styleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";

const resizerPoints = ["bottomCenter"];
const resizerRestrictions = {
  height: {
    min: 10,
    max: Infinity
  },
  mobileHeight: {
    min: 10,
    max: Infinity
  }
};

class Spacer extends EditorComponent {
  static get componentId() {
    return "Spacer";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v) {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <BoxResizer
          points={resizerPoints}
          restrictions={resizerRestrictions}
          meta={this.props.meta}
          value={v}
          onChange={this.handleResizerChange}
        >
          <div className={styleClassName(v)} style={styleCSSVars(v)} />
        </BoxResizer>
      </Toolbar>
    );
  }
}

export default Spacer;
