import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import Config from "visual/global/Config";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { xss } from "visual/utils/xss";

const resizerPoints = ["centerLeft", "centerRight"];

class WPCustomShortcode extends EditorComponent {
  static get componentId() {
    return "WPCustomShortcode";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  handleValueChange(newValue, meta) {
    const config = Config.getAll();

    if (meta.patch.shortcode && !config.user.isWpAdmin) {
      const xssShortcode = xss(newValue.shortcode, "discard");
      super.handleValueChange({ ...newValue, shortcode: xssShortcode });
    } else {
      super.handleValueChange(newValue, meta);
    }
  }

  renderForEdit(v, vs, vd) {
    const { className } = v;
    const classNameWP = classnames(
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      ),
      className
    );
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <WPShortcode
            raw={v.shortcode}
            placeholderIcon="wp-custom-shortcode"
            className={classNameWP}
            height={45}
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

export default WPCustomShortcode;
