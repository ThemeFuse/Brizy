import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export interface Value extends ElementModel {
  embededCode: string;
}

export class TrustedBadge extends EditorComponent<Value> {
  static get componentId(): "TrustedBadge" {
    return "TrustedBadge";
  }

  static defaultValue = defaultValue;

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({ className: "brz-shopify-trusted-badge" })}
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
        {...this.makeWrapperProps({ className: "brz-shopify-trusted-badge" })}
      >
        <div
          {...makeDataAttr({ name: "pf-type", value: "TrustedSite" })}
          dangerouslySetInnerHTML={{ __html: embededCode }}
        />
      </Wrapper>
    );
  }
}
