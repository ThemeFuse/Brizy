import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import TextEditor from "visual/editorComponents/Text/Editor";
import CustomCSS from "visual/component/CustomCSS";
import ThemeIcon from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import defaultValue from "./defaultValue.json";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";

class StarRating extends EditorComponent {
  static get componentId() {
    return "StarRating";
  }

  static defaultValue = defaultValue;

  handleTextChange = text => {
    this.patchValue({ text });
  };

  renderStars(i, rating, v) {
    const { iconName, iconType } = v;

    // eslint-disable-next-line no-unused-vars
    const [x, y] = String(rating).split(".");
    const needIcon = i < rating;

    const className = classnames("brz-starrating-color", {
      "brz-starrating-color-full": i < rating,
      [`brz-starrating-color-w${y}`]: y && Math.floor(rating) === i
    });

    return (
      <div key={i} className="brz-starrating-icon-wrap">
        <ThemeIcon
          name={iconName}
          type={iconType}
          className="brz-starrating-color-empty"
        />
        {needIcon && (
          <span className={className}>
            <ThemeIcon name={iconName} type={iconType} />
          </span>
        )}
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const label = v.label;
    const rating = v.rating;

    const className = classnames(
      "brz-starrating",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const starArray = Array(5).fill();

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={className}>
            {label !== "off" && (
              <TextEditor
                className="brz-starrating-text"
                value={v.text}
                onChange={this.handleTextChange}
              />
            )}

            <div className="brz-starrating-container" title={rating}>
              {starArray.map((_, i) => this.renderStars(i, rating, v))}
            </div>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default StarRating;
