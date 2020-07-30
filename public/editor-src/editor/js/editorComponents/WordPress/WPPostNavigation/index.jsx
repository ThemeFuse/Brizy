import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { WPShortcode } from "../common/WPShortcode";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import classnames from "classnames";
import { style } from "./styles";
import { css } from "visual/utils/cssStyle";

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
          <div className={className}>
            {showTitle === "on" && (
              <div className="brz-navigation-title">
                <TextEditor
                  className="brz-navigation-title__prev"
                  value={previous}
                  onChange={this.handleChangePrevious}
                />
                <TextEditor
                  className="brz-navigation-title__next"
                  value={next}
                  onChange={this.handleChangeNext}
                />
              </div>
            )}
            {showPost === "on" && (
              <div className="brz-wp-shortcode">
                <div className="brz-blocked">
                  <div className="brz-navigation">
                    <a
                      className="brz-a brz-navigation__prev"
                      href="#"
                      rel="prev"
                    >
                      Previous post
                    </a>
                    <a
                      className="brz-a brz-navigation__next"
                      href="#"
                      rel="next"
                    >
                      Next post
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
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

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={className}>
          <WPShortcode
            name="brizy_post_navigation"
            attributes={attributes}
            placeholderIcon="wp-shortcode"
          />
        </div>
      </CustomCSS>
    );
  }
}

export default WPPostNavigation;
