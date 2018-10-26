import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component-new/Toolbar";
import toolbarConfigFn from "./toolbar";
import defaultValue from "./defaultValue.json";
import { styleClassName, styleCSSVars } from "./styles";
import * as Api from "visual/utils/api/editor";

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
    Api.getSidebars().then(sidebars => {
      this.setState({ sidebars });

      const v = this.getValue();
      if (v.sidebar === "" && sidebars.length > 0) {
        this.patchValue({ sidebar: sidebars[0].id });
      }
    });
  }

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v) {
    const toolbarConfig = toolbarConfigFn(this.state.sidebars);
    const attributes = {
      id: v.sidebar
    };

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <WPShortcode
          name="brizy_sidebar"
          attributes={attributes}
          placeholderIcon="wp-shortcode"
          placeholderContainerWidth={this.props.meta.desktopW}
          className={styleClassName(v)}
          style={styleCSSVars(v)}
          resizerPoints={resizerPoints}
          resizerMeta={this.props.meta}
          resizerValue={v}
          resizerOnChange={this.handleResizerChange}
        />
      </Toolbar>
    );
  }
}

export default WPSidebar;
