import classNames from "classnames";
import React, { ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Content } from "visual/editorComponents/PostInfo/Content";
import { readPostElements } from "visual/editorComponents/PostInfo/utils";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";

class PostInfo extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.PostInfo {
    return ElementTypes.PostInfo;
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classNames(
      "brz-post-info",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    const { customCss, postElements } = v;
    const elements = readPostElements(postElements);

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCss}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <Content
              postElements={elements}
              renderContext={this.renderContext}
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default PostInfo;
