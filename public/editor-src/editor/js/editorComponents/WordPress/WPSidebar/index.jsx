import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import toolbarConfigFn from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { getSidebars } from "visual/utils/api";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "../../tools/Wrapper";

class WPSidebar extends EditorComponent {
  static get componentId() {
    return "WPSidebar";
  }

  static defaultValue = defaultValue;

  state = {
    sidebars: []
  };

  componentDidMount() {
    getSidebars().then(sidebars => {
      this.setState({ sidebars });

      const v = this.getValue();
      if (v.sidebar === "" && sidebars.length > 0) {
        this.patchValue({ sidebar: sidebars[0].id });
      }
    });
  }

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const { className } = v;

    const toolbarConfig = toolbarConfigFn(this.state.sidebars);

    const classNameWP = classnames(
      "brz-wp__sidebar",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      ),
      className
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className: classNameWP })}>
            <DynamicContentHelper
              placeholder={`{{editor_sidebar id="${v.sidebar}"}}`}
              tagName="div"
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WPSidebar;
