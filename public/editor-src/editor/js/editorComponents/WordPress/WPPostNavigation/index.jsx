import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { TextEditor } from "visual/component/Controls/TextEditor";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { Wrapper } from "../../tools/Wrapper";

class WPPostNavigation extends EditorComponent {
  static get componentId() {
    return "WPPostNavigation";
  }

  static defaultValue = defaultValue;

  handleChangeNext = next => {
    this.patchValue({ next });
  };

  handleChangePrevious = previous => {
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

    const attributesStr = Object.keys(attributes)
      .map(k => String(attributes[k]) && `${k}="${attributes[k]}"`)
      .join(" ");

    const placeholder = `{{editor_post_navigation ${attributesStr}}}`;

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
