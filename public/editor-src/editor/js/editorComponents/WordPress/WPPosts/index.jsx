import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

const resizerPoints = ["centerLeft", "centerRight"];

class WPPosts extends EditorComponent {
  static get componentId() {
    return "WPPosts";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  renderForEdit(v, vs, vd) {
    const { className } = v;

    const attributes = {
      numberposts: v.numberPosts,
      category: v.category,
      orderby: v.orderBy,
      order: v.order,
      include: v.include,
      exclude: v.exclude,
      meta_key: v.metaKey,
      meta_value: v.metaValue,
      post_type: v.postType,
      post_status: v.postStatus
    };

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
            name="brizy_posts"
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

export default WPPosts;
