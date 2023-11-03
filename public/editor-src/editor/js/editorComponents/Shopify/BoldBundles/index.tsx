import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export class BoldBundles extends EditorComponent<ElementModel> {
  static get componentId(): "BoldBundles" {
    return "BoldBundles";
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-bold-bundle"
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
        {...this.makeWrapperProps({ className: "brz-shopify-bold-bundle" })}
      >
        <div {...makeDataAttr({ name: "pf-type", value: "BoldBundles" })}>
          {'{% render "shappify-bdl-load-bundle", product: product %}'}
        </div>
      </Wrapper>
    );
  }
}
