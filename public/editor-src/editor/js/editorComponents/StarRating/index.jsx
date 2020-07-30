import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import ThemeIcon from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import { Wrapper } from "../tools/Wrapper";

export default class StarRating extends EditorComponent {
  static get componentId() {
    return "StarRating";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleTextChange = patch => {
    this.patchValue(patch);
  };

  renderStars(v) {
    const { iconName, iconType, rating } = v;

    const stars = Array(5)
      .fill()
      .map((_, i) => (
        <div key={i} className="brz-starrating-icon-wrap">
          <ThemeIcon
            name={iconName}
            type={iconType}
            className="brz-starrating-color-empty"
          />
          <span
            className="brz-starrating-color"
            style={{
              // this is done with calc because v.rating can have dynamic content
              // which means that we can not do the math in js,
              // because it would look like: "{{ brizy_dc_post_title }}" - i
              width: `calc((${v.rating} - ${i}) * 100%)`
            }}
          >
            <ThemeIcon name={iconName} type={iconType} />
          </span>
        </div>
      ));

    return (
      <div className="brz-starrating-container" title={rating}>
        {stars}
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const { iconName, iconType, label, rating } = v;
    const className = classnames(
      "brz-starrating",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );
    const labelText = (
      <Text
        className="brz-starrating-text"
        id="text"
        v={v}
        onChange={this.handleTextChange}
      />
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            {v.ratingStyle === "style1" && (
              <>
                {label === "on" && labelText}
                <div className="brz-starrating-container" title={rating}>
                  {this.renderStars(v)}
                </div>
                {label === "on-right" && labelText}
              </>
            )}

            {v.ratingStyle === "style2" && (
              <div className="brz-starrating-style2-container">
                <span className="brz-starrating-text">{rating}</span>
                {label !== "off" && (
                  <ThemeIcon
                    className="brz-starrating-icon-wrap"
                    name={iconName}
                    type={iconType}
                  />
                )}
              </div>
            )}
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}
