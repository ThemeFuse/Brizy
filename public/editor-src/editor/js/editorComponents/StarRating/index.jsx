import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import ThemeIcon from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import defaultValue from "./defaultValue.json";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";

class StarRating extends EditorComponent {
  static get componentId() {
    return "StarRating";
  }

  static defaultValue = defaultValue;

  renderStars(i, rating) {
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
          name="star"
          type="editor"
          className="brz-starrating-color-empty"
        />
        {needIcon && (
          <span className={className}>
            <ThemeIcon name="star" type="editor" />
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
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={className}>
            {label !== "" && (
              <span className="brz-starrating-text">{label}</span>
            )}

            <div className="brz-starrating-container" title={rating}>
              {starArray.map((_, i) => this.renderStars(i, rating))}
            </div>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default StarRating;
