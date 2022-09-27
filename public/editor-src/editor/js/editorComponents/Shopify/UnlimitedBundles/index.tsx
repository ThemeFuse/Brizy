import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export interface Value extends ElementModel {
  embededCode: string;
}

export class UnlimitedBundles extends EditorComponent<Value> {
  static get componentId(): "UnlimitedBundles" {
    return "UnlimitedBundles";
  }

  static defaultValue = defaultValue;

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-unlimited-bundles"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(v: Value): ReactNode {
    const { embededCode } = v;

    return (
      <Wrapper
        {...this.makeWrapperProps({
          className: "brz-shopify-unlimited-bundles"
        })}
      >
        <div
          data-pf-type="RevyBundle"
          dangerouslySetInnerHTML={{ __html: embededCode }}
        />
      </Wrapper>
    );
  }
}
