import React, { ReactNode } from "react";
import classnames from "classnames";
import EditorComponent, {
  ComponentsMeta
} from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import BoxResizer from "visual/component/BoxResizer";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import { Wrapper } from "../tools/Wrapper";
import { Text } from "visual/component/ContentOptions/types";
import { ThemeIcon } from "visual/component/ThemeIcon";

import { ElementModel } from "visual/component/Elements/Types";
import { WithClassName } from "visual/utils/options/attributes";
import { Patch } from "visual/component/BoxResizer/types";

export type Value = ElementModel & {
  iconName: string;
  iconType: string;
  style: "text" | "icon" | "default";
};

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
    const { iconName, iconType, style } = v;

    switch (style) {
      case "text":
        return (
          <span className="brz-line-container">
            <Text
              className="brz-line-content"
              id="text"
              v={v}
              onChange={this.handleTextChange}
            />
          </span>
        );
      case "icon":
        return (
          <span className="brz-line-container">
            <ThemeIcon
              className="brz-line-content"
              name={iconName}
              type={iconType}
            />
          </span>
        );
      case "default":
        return <hr className="brz-hr" />;
    }
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-line",
      `brz-line-${v.style}`,
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
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
