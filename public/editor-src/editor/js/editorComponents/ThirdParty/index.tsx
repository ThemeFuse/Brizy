import React, { ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  ComponentsMeta
} from "visual/editorComponents/EditorComponent";
import Editor from "visual/global/Editor";
import { WithClassName } from "visual/utils/options/attributes";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";
import { getComponentProps } from "./utils";

export interface Value extends ElementModel {
  thirdPartyId: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

class ThirdParty extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "ThirdParty";
  }

  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  renderComponent(v: Value) {
    const thirdPartyId = v.thirdPartyId;
    const components = Editor.getThirdPartyElements();
    const { component: Component, config } = components[thirdPartyId];
    const options = config.options ?? [];
    const props = getComponentProps(v, options);

    if (typeof Component === "function") {
      const getItems = () => options;

      const componentToolbar = this.makeToolbarPropsFromConfig2({ getItems });

      return (
        <Toolbar {...componentToolbar}>
          <Component {...props} />
        </Toolbar>
      );
    }

    return `Missing Third Party Component: ${thirdPartyId}`;
  }

  renderForEdit(v: Value): ReactNode {
    const { customCSS } = v;
    const className = "brz-third-party";

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            {this.renderComponent(v)}
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default ThirdParty;
