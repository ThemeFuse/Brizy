import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "../../tools/Wrapper";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { Text } from "visual/component/ContentOptions/types";

const resizerPoints = ["centerLeft", "centerRight"];

export default class WOOAttributes extends EditorComponent {
  static get componentId() {
    return "WOOAttributes";
  }

  static defaultValue = defaultValue;
  handleResizerChange = patch => this.patchValue(patch);
  handleTextChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const { className: className_ } = v;

    const className = classnames(
      "brz-woo-attributes",
      className_,
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const restrictions = {
      width: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      tabletWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      mobileWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
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
              {v.title === "on" && (
                <Text
                  className="brz-woo-attributes_title"
                  id="titleText"
                  v={v}
                  onChange={this.handleTextChange}
                />
              )}
              <DynamicContentHelper
                placeholder="{{editor_product_additional_info}}"
                placeholderIcon="woo-attributes"
                tagName="div"
              />
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}
