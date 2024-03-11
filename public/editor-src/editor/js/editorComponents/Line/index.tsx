import classnames from "classnames";
import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Patch } from "visual/component/BoxResizer/types";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { WithClassName } from "visual/utils/options/attributes";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { isDefaultLineType } from "./utils";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";

export interface Value extends ElementModel {
  iconName: string;
  iconType: string;
  lineStyle: string;
  style: "text" | "icon" | "default";
  tagName: keyof JSX.IntrinsicElements;
}

interface Props extends WithClassName {
  meta: ComponentsMeta;
}

const resizerPoints = ["centerLeft", "centerRight"];
const resizerRestrictions = {
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
class Line extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "Line";
  }
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  handleResizerChange = (patch: Patch): void => this.patchValue(patch);
  handleTextChange = (patch: { [k: string]: string }): void => {
    this.patchValue(patch);
  };

  renderLine(v: Value): ReactNode {
    const { iconName, iconType, style, lineStyle, tagName } = v;

    switch (style) {
      case "text":
        return (
          <span className="brz-line-container">
            <Text
              className="brz-line-content"
              id="text"
              v={v}
              onChange={this.handleTextChange}
              tagName={tagName}
            />
          </span>
        );
      case "icon":
        return (
          <span className="brz-line-container">
            <span className="brz-line-icon-wrapper">
              <ThemeIcon
                className="brz-line-content"
                name={iconName}
                type={iconType}
              />
            </span>
          </span>
        );
      case "default":
        return isDefaultLineType(lineStyle) ? (
          <hr className="brz-hr" />
        ) : (
          <span className="brz-line-container"></span>
        );
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { customCSS } = v;

    const className = classnames(
      "brz-line",
      `brz-line-${v.style}`,
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <BoxResizer
              points={resizerPoints}
              restrictions={resizerRestrictions}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {this.renderLine(v)}
            </BoxResizer>
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}
export default Line;
