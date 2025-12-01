import { Str } from "@brizy/readers";
import React, { createRef } from "react";
import { AnimatedHeadline as Control } from "visual/component/AnimatedHeadline";
import { AnimationStyle } from "visual/component/AnimatedHeadline/types";
import CustomCSS from "visual/component/CustomCSS";
import { ElementProps } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";
import { getAnimationOptions } from "./utils";

class AnimatedHeadline extends EditorComponent<Value, ElementProps> {
  static get componentId(): ElementTypes.AnimatedHeadline {
    return ElementTypes.AnimatedHeadline;
  }

  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  wrapperRef = createRef<HTMLDivElement>();

  getAttributes(): Record<string, string> {
    const v = this.getValue();
    const options = getAnimationOptions(v);

    return Object.entries(options).reduce((acc, [name, _value]) => {
      const value =
        typeof _value === "boolean" ? String(_value) : Str.read(_value);

      if (value) {
        return {
          ...acc,
          ...makeDataAttr({
            name: name.toLocaleLowerCase(),
            value
          })
        };
      }
      return acc;
    }, {});
  }

  renderForEdit(v: Value): JSX.Element {
    const options = getAnimationOptions(v);
    const { isBringToFront } = v;
    const { animationStyle } = options;

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      sidebars: [sidebarConfig],
      extraClassNames: [
        "brz-animatedHeadline--wrapper",
        {
          "brz-animatedHeadline--style-svg-to-Front":
            animationStyle === AnimationStyle.svg && isBringToFront === "on"
        }
      ]
    });

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
                  ref: (el) =>
                    attachRefs(el, [toolbarRef, cssRef, this.wrapperRef])
                })}
              >
                <Control {...options} ref={this.wrapperRef} />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }

  renderForView(v: Value): JSX.Element {
    const options = getAnimationOptions(v);
    const { isBringToFront } = v;
    const { animationStyle } = options;

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      sidebars: [sidebarConfig],
      extraClassNames: [
        "brz-animatedHeadline--wrapper",
        {
          "brz-animatedHeadline--style-svg-to-Front":
            animationStyle === AnimationStyle.svg && isBringToFront === "on"
        }
      ]
    });

    const attributes = this.getAttributes();

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <Wrapper
          {...this.makeWrapperProps({
            className,
            attributes
          })}
        >
          <Control {...options} />
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default AnimatedHeadline;
