import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export class TrustMeBadges extends EditorComponent<ElementModel> {
  static get componentId(): "TrustMeBadges" {
    return "TrustMeBadges";
  }

  static defaultValue = defaultValue;

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-trust-me-badges"
          })}
        >
          <Placeholder icon="shopify" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(): ReactNode {
    return (
      <Wrapper
        {...this.makeWrapperProps({ className: "brz-shopify-trust-me-badges" })}
      >
        <div className="giraffly-trust-badge" />
      </Wrapper>
    );
  }
}
