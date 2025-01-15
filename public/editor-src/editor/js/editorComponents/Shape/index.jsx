import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

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

  handleResizerChange = (patch) => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const wrapperClassName = classnames(
      "brz-shape",
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
