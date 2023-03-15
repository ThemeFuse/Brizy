import classnames from "classnames";
import { StarRating1 } from "component/Flex/StarRating1";
import { StarRating2 } from "component/Flex/StarRating2";
import React from "react";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

export default class StarRating extends EditorComponent {
  static get componentId() {
    return "StarRating";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleTextChange = (patch) => {
    this.patchValue(patch);
  };

  renderForEdit(v, vs, vd) {
    const { iconName, iconType, label, rating, ratingScale, ratingStyle } = v;
    const className = classnames(
      "brz-starrating",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );

    const labelElement = (
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
            {ratingStyle === "style1" && (
              <StarRating1
                label={labelElement}
                showLeftLabel={label === "on"}
                showRightLabel={label === "on-right"}
                rating={rating}
                ratingScale={ratingScale}
                iconName={iconName}
                iconType={iconType}
              />
            )}

            {ratingStyle === "style2" && (
              <StarRating2
                showIcon={label !== "off"}
                rating={rating}
                iconName={iconName}
                iconType={iconType}
              />
            )}
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const { iconName, iconType, label, rating, ratingScale, ratingStyle } = v;
    const className = classnames(
      "brz-starrating",
      css(this.constructor.componentId, this.getId(), style(v, vs, vd))
    );
    const labelElement = (
      <Text
        className="brz-starrating-text"
        id="text"
        v={v}
        onChange={this.handleTextChange}
      />
    );
    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {ratingStyle === "style1" && (
            <StarRating1
              label={labelElement}
              showLeftLabel={label === "on"}
              showRightLabel={label === "on-right"}
              rating={rating}
              ratingScale={ratingScale}
              iconName={iconName}
              iconType={iconType}
            />
          )}

          {ratingStyle === "style2" && (
            <StarRating2
              showIcon={label !== "off"}
              rating={rating}
              iconName={iconName}
              iconType={iconType}
            />
          )}
        </Wrapper>
      </CustomCSS>
    );
  }
}
