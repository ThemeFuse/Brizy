import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export class CrossSell extends EditorComponent<ElementModel> {
  static get componentId(): "CrossSell" {
    return "CrossSell";
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-cross-sell"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(): ReactNode {
    return (
      <Wrapper
        {...this.makeWrapperProps({ className: "brz-shopify-cross-sell" })}
      >
        <div data-pf-type="CrossSell">{'{% include "cross-sell" %}'}</div>
      </Wrapper>
    );
  }
}
