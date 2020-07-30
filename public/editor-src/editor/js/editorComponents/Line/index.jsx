import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import BoxResizer from "visual/component/BoxResizer";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import { Wrapper } from "../tools/Wrapper";

const resizerPoints = ["centerLeft", "centerRight"];

class Line extends EditorComponent {
  static get componentId() {
    return "Line";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-line",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const restrictions = {
      width: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      // Tablet
      tabletWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      // Mobile
      mobileWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      }
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <BoxResizer
              points={resizerPoints}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
              restrictions={restrictions}
            >
              <hr className="brz-hr" />
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default Line;
