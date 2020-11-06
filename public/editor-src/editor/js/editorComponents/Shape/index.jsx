import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";

const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

class Shape extends EditorComponent {
  static get componentId() {
    return "Shape";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const wrapperClassName = classnames(
      "brz-shape",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const resizerRestrictions = {
      height: {
        "%": { min: 5, max: Infinity }
      },
      width: {
        "%": { min: 5, max: 100 }
      }
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className: wrapperClassName })}>
            <BoxResizer
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Shape;
