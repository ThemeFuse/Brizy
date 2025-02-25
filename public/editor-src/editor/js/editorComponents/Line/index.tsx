import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Patch } from "visual/component/BoxResizer/types";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";
import type { Props, Value } from "./types";
import { isDefaultLineType } from "./utils";

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
    const { iconName, iconType, iconFilename, style, lineStyle, tagName } = v;

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
                filename={iconFilename}
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

  renderForEdit(v: Value): ReactNode {
    const { style, customCSS } = v;

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      sidebars: [sidebarConfig],
      extraClassNames: ["brz-line", `brz-line-${style}`]
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
                })}
              >
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
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}
export default Line;
