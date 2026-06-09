import { StarRating1 } from "@brizy/component/src/Flex/StarRating1";
import { StarRating2 } from "@brizy/component/src/Flex/StarRating2";
import classnames from "classnames";
import React from "react";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

export default class StarRating extends EditorComponent {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId() {
    return ElementTypes.StarRating;
  }

  handleTextChange = (patch) => {
    this.patchValue(patch);
  };

  getIconComponent = (iconProps) => (props) => (
    <ThemeIcon {...iconProps} {...props} />
  );

  renderForEdit(v, vs, vd) {
    const {
      iconName,
      iconType,
      iconFilename,
      label,
      rating,
      ratingScale,
      ratingStyle
    } = v;
    const className = classnames(
      "brz-starrating",
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
      )
    );

    const labelElement = (
      <Text
        className="brz-starrating-text"
        id="text"
        v={v}
        onChange={this.handleTextChange}
      />
    );

    const iconProps = {
      name: iconName,
      type: iconType,
      filename: iconFilename
    };

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => attachRefs(el, [toolbarRef, cssRef])
                })}
              >
                {ratingStyle === "style1" && (
                  <StarRating1
                    Icon={this.getIconComponent(iconProps)}
                    label={labelElement}
                    showLeftLabel={label === "on"}
                    showRightLabel={label === "on-right"}
                    rating={rating}
                    ratingScale={ratingScale}
                  />
                )}

                {ratingStyle === "style2" && (
                  <StarRating2
                    Icon={this.getIconComponent(iconProps)}
                    showIcon={label !== "off"}
                    rating={rating}
                  />
                )}
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const {
      iconName,
      iconType,
      iconFilename,
      label,
      rating,
      ratingScale,
      ratingStyle
    } = v;
    const className = classnames(
      "brz-starrating",
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
      )
    );
    const labelElement = (
      <Text
        className="brz-starrating-text"
        id="text"
        v={v}
        onChange={this.handleTextChange}
      />
    );

    const iconProps = {
      name: iconName,
      type: iconType,
      filename: iconFilename
    };

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          {ratingStyle === "style1" && (
            <StarRating1
              Icon={this.getIconComponent(iconProps)}
              label={labelElement}
              showLeftLabel={label === "on"}
              showRightLabel={label === "on-right"}
              rating={rating}
              ratingScale={ratingScale}
            />
          )}

          {ratingStyle === "style2" && (
            <StarRating2
              Icon={this.getIconComponent(iconProps)}
              showIcon={label !== "off"}
              rating={rating}
            />
          )}
        </Wrapper>
      </CustomCSS>
    );
  }
}
