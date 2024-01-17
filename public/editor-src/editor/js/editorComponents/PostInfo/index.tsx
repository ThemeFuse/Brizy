import React, { ReactNode } from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import defaultValue from "./defaultValue.json";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import Toolbar from "visual/component/Toolbar";
import CustomCSS from "visual/component/CustomCSS";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import classNames from "classnames";
import { css } from "visual/utils/cssStyle";
import { Content } from "visual/editorComponents/PostInfo/Content";
import { style } from "./styles";
import { Value } from "./types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { readPostElements } from "visual/editorComponents/PostInfo/utils";

class PostInfo extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.PostInfo {
    return ElementTypes.PostInfo;
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classNames(
      "brz-post-info",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    const { customCss, postElements } = v;
    const elements = readPostElements(postElements);

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCss}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <Content postElements={elements} />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default PostInfo;
