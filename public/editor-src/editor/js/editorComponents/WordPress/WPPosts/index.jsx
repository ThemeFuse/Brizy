import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { attachRefs } from "visual/utils/react";
import { WPShortcode } from "../common/WPShortcode";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = ["centerLeft", "centerRight"];

class WPPosts extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "WPPosts";
  }

  handleResizerChange = (patch) => this.patchValue(patch);

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

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
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
                renderContext={this.props.renderContext}
                config={this.getGlobalConfig()}
                containerRef={(el) => attachRefs(el, [toolbarRef, cssRef])}
              />
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}

export default WPPosts;
