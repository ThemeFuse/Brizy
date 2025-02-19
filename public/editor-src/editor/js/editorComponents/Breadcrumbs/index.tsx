import { Json } from "@brizy/readers";
import classNames from "classnames";
import React from "react";
import { BreadcrumbsEditor } from "visual/component/BrizyBuilder";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { DCApiProxyInstance } from "visual/editorComponents/EditorComponent/DynamicContent/DCApiProxyInstance";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getCurrentPageId } from "visual/utils/env";
import { attachRefs } from "visual/utils/react";
import { BreadcrumbsPreview } from "./components/BreadcrumbsPreview";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";
import { readBreadcrumbs } from "./utils";

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
    const globalConfig = this.getGlobalConfig();

    DCApiProxyInstance.getDC([placeholder], {
      postId: getCurrentPageId(globalConfig),
      globalConfig
    }).then((res) => this.setState({ breadcrumbContent: Json.read(res[0]) }));
  }

  renderForEdit(v: Value, vs: Value, vd: Value) {
    const { breadcrumbContent } = this.state;
    const { customCSS } = v;

    const items = readBreadcrumbs(breadcrumbContent);
    const className = classNames(
      "brz-breadcrumbs",
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

    return items.length ? (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
                })}
              >
                <BreadcrumbsEditor items={items} />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    ) : (
      <Placeholder icon="wp-breadcrumbs" style={placeholderStyle} />
    );
  }

  renderForView(v: Value, vs: Value, vd: Value) {
    const { customCSS } = v;
    const className = classNames(
      "brz-breadcrumbs",
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
      <CustomCSS selectorName={this.getId()} css={customCSS}>
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
