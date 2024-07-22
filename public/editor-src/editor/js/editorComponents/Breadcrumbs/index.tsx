import classNames from "classnames";
import React from "react";
import { BreadcrumbsEditor } from "visual/component/BrizyBuilder";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DCApiProxyInstance } from "visual/editorComponents/EditorComponent/DynamicContent/DCApiProxy";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { css } from "visual/utils/cssStyle";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getCurrentPageId } from "visual/utils/env";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";
import { readBreadcrumbs } from "./utils";
import { Json } from "@brizy/readers";
import { BreadcrumbsPreview } from "./components/BreadcrumbsPreview";

const placeholderStyle = {
  height: "40px"
};

class Breadcrumbs extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  state = {
    breadcrumbContent: []
  };

  static get componentId(): ElementTypes.Breadcrumbs {
    return ElementTypes.Breadcrumbs;
  }

  componentDidMount() {
    this.getBreadcrumbsDC();
  }

  getBreadcrumbsDC() {
    const placeholder = makePlaceholder({
      content: "{{brizy_dc_breadcrumbs}}",
      attr: {
        content_type: "json"
      }
    });

    DCApiProxyInstance.getDC([placeholder], {
      postId: getCurrentPageId()
    }).then((res) => this.setState({ breadcrumbContent: Json.read(res[0]) }));
  }

  renderForEdit(v: Value, vs: Value, vd: Value) {
    const { breadcrumbContent } = this.state;
    const { customCss } = v;

    const items = readBreadcrumbs(breadcrumbContent);
    const className = classNames(
      "brz-breadcrumbs",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return items.length ? (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCss}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <BreadcrumbsEditor items={items} />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    ) : (
      <Placeholder icon="wp-breadcrumbs" style={placeholderStyle} />
    );
  }

  renderForView(v: Value, vs: Value, vd: Value) {
    const { customCss } = v;
    const className = classNames(
      "brz-breadcrumbs",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCss}>
        <Wrapper
          {...this.makeWrapperProps({
            className
          })}
        >
          <BreadcrumbsPreview />
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default Breadcrumbs;
