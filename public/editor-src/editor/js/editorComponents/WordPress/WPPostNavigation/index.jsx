import classnames from "classnames";
import React from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { css } from "visual/utils/cssStyle";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

class WPPostNavigation extends EditorComponent {
  static get componentId() {
    return "WPPostNavigation";
  }

  static defaultValue = defaultValue;

  handleChangeNext = (next) => {
    this.patchValue({ next });
  };

  handleChangePrevious = (previous) => {
    this.patchValue({ previous });
  };

  attributesData(v) {
    const categories = JSON.parse(v.categories);

    if (categories.length === 0) {
      return { post_type: "post" };
    }

    return categories.reduce(
      (acc, curr) => {
        return { ...acc, [`${curr}_taxonomy`]: v[curr] };
      },
      { post_type: categories.join() }
    );
  }

  renderForEdit(v, vs, vd) {
    const { next, previous, showTitle, showPost } = v;
    const className = classnames(
      "brz-single-post-navigation",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            {showTitle === "on" && (
              <div className="brz-navigation-title">
                <TextEditor
                  value={previous}
                  onChange={this.handleChangePrevious}
                />
                <TextEditor value={next} onChange={this.handleChangeNext} />
              </div>
            )}
            {showPost === "on" && (
              <div className="brz-wp-shortcode">
                <div className="brz-navigation">
                  <a className="brz-a" href="#" rel="prev">
                    Previous post
                  </a>
                  <a className="brz-a" href="#" rel="next">
                    Next post
                  </a>
                </div>
              </div>
            )}
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const { next, previous, showTitle, showPost } = v;
    const className = classnames(
      "brz-single-post-navigation",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const attributes = {
      showTitle,
      showPost,
      ...this.attributesData(v),
      ...(showTitle === "on" && { titlePrevious: previous, titleNext: next })
    };

    const placeholder = makePlaceholder({
      content: "{{editor_post_navigation}}",
      attr: attributes
    });

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          <DynamicContentHelper placeholder={placeholder} tagName="div" />
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default WPPostNavigation;
