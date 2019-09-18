import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import BoxResizer from "visual/component/BoxResizer";
import classnames from "classnames";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

import defaultValue from "./defaultValue.json";

const resizerPoints = ["bottomCenter"];
const resizerRestrictions = {
  height: {
    min: 10,
    max: Infinity
  },
  tabletHeight: {
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

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-spacer",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <BoxResizer
          points={resizerPoints}
          restrictions={resizerRestrictions}
          meta={this.props.meta}
          value={v}
          onChange={this.handleResizerChange}
        >
          <div className={className} />
        </BoxResizer>
      </Toolbar>
    );
  }
}

export default Spacer;
