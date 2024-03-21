import classNames from "classnames";
import { Base64 } from "js-base64";
import React from "react";
import {
  BreadcrumbsEditor,
  BreadcrumbsPreview
} from "visual/component/BrizyBuilder";
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

const placeholderStyle = {
  height: "40px"
};

class Breadcrumbs extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.Breadcrumbs {
    return ElementTypes.Breadcrumbs;
  }

  componentDidMount() {
    this.getBreadcrumbsDC();
  }

  getBreadcrumbsDC() {
    const placeholder = makePlaceholder({
      content: "{{brizy_dc_breadcrumbs}}"
    });

    DCApiProxyInstance.getDC([placeholder], {
      postId: getCurrentPageId()
    }).then((res) => {
      const { breadcrumbContent } = this.getValue();
      const decodedRes = Base64.decode(res[0]);

      if (breadcrumbContent !== decodedRes) {
        this.patchValue({
          breadcrumbContent: decodedRes
        });
      }
    });
  }

  renderComponent(v: Value, vs: Value, vd: Value) {
    const { breadcrumbContent, customCss } = v;
    const items = readBreadcrumbs(breadcrumbContent);
    const className = classNames(
      "brz-breadcrumbs",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCss}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            {IS_EDITOR ? (
              <BreadcrumbsEditor items={items} />
            ) : (
              <BreadcrumbsPreview items={items} />
            )}
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForEdit(v: Value, vs: Value, vd: Value) {
    const { breadcrumbContent } = v;
    const items = readBreadcrumbs(breadcrumbContent);

    return items.length ? (
      this.renderComponent(v, vs, vd)
    ) : (
      <Placeholder icon="wp-breadcrumbs" style={placeholderStyle} />
    );
  }

  renderForView(v: Value, vs: Value, vd: Value) {
    return this.renderComponent(v, vs, vd);
  }
}

export default Breadcrumbs;
