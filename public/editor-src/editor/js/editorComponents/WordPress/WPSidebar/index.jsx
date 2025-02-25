import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { getSidebars } from "visual/utils/api";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import toolbarConfigFn from "./toolbar";

class WPSidebar extends EditorComponent {
  static defaultValue = defaultValue;
  state = {
    sidebars: []
  };

  static get componentId() {
    return "WPSidebar";
  }

  componentDidMount() {
    getSidebars(this.getGlobalConfig()).then((sidebars) => {
      this.setState({ sidebars });

      const v = this.getValue();
      if (v.sidebar === "" && sidebars.length > 0) {
        this.patchValue({ sidebar: sidebars[0].id });
      }
    });
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const { className } = v;

    const toolbarConfig = toolbarConfigFn(this.state.sidebars);

    const classNameWP = classnames(
      "brz-wp__sidebar",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      ),
      className
    );
    const placeholder = makePlaceholder({
      content: "{{editor_sidebar}}",
      attr: { sidebarId: v.sidebar }
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className: classNameWP,
                  ref: (el) => attachRefs(el, [toolbarRef, cssRef])
                })}
              >
                <DynamicContentHelper placeholder={placeholder} tagName="div" />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}

export default WPSidebar;
