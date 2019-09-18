import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import toolbarConfigFn from "./toolbar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { getSidebars } from "visual/utils/api/editor";

const resizerPoints = ["centerLeft", "centerRight"];

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
    const attributes = {
      id: v.sidebar
    };

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
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <WPShortcode
            name="brizy_sidebar"
            attributes={attributes}
            placeholderIcon="wp-shortcode"
            placeholderContainerWidth={this.props.meta.desktopW}
            className={classNameWP}
            resizerPoints={resizerPoints}
            resizerMeta={this.props.meta}
            resizerValue={v}
            resizerOnChange={this.handleResizerChange}
          />
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default WPSidebar;
