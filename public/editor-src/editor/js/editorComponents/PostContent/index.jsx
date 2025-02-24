import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getPopulatedEntityValues } from "visual/utils/dynamicContent/common";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

export default class WPPostContent extends EditorComponent {
  // NOTE: initially this element was for WordPress only.
  // After we needed to make it work for cloud as well, it was renamed,
  static defaultValue = defaultValue;

  // but since we don't have a good migration system yet, the old componentId still remains
  static get componentId() {
    return "WPPostContent";
  }

  renderForEdit(v, vs, vd) {
    const {
      textPopulation,
      textPopulationEntityId,
      textPopulationEntityType,
      className: className_
    } = v;

    const attr = getPopulatedEntityValues(
      textPopulationEntityId,
      textPopulationEntityType
    );

    const placeholder = makePlaceholder({ content: textPopulation, attr });
    const className = classnames(
      "brz-wp-post-content",
      className_,
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
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
                })}
              >
                <DynamicContentHelper
                  placeholder={placeholder}
                  placeholderIcon="wp-content"
                  tagName="div"
                />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}
