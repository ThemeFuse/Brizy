import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { styleClassName, styleCSSVars } from "./styles";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import BoxResizer from "visual/component/BoxResizer";

const resizerPoints = ["centerLeft", "centerRight"];

class Line extends EditorComponent {
  static get componentId() {
    return "Line";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(_v) {
    const v = this.applyRulesToValue(_v, [
      _v.borderColorPalette && `${_v.borderColorPalette}__border`
    ]);

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={styleClassName(v)} style={styleCSSVars(v)}>
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              <hr className="brz-hr" />
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Line;
