import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export type WidgetType = "recent" | "summary" | "tab" | "badge";

export interface Value extends ElementModel {
  widgetType: WidgetType;
  embededCode: string;
}

export class EmailMarketing extends EditorComponent<Value> {
  static get componentId(): "EmailMarketing" {
    return "EmailMarketing";
  }
  static defaultValue = defaultValue;

  renderCMWidget(type: WidgetType, code: string): ReactNode {
    switch (type) {
      case "recent":
      case "summary":
      case "tab":
      case "badge":
        return (
          <div
            data-pf-type="CMCommerce"
            dangerouslySetInnerHTML={{ __html: code }}
          />
        );
    }
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-email-marketing"
          })}
        >
          <Placeholder icon="img" />
        </Wrapper>
      </Toolbar>
    );
  }

  renderForView(v: Value): ReactNode {
    const { widgetType, embededCode } = v;

    return (
      <Wrapper
        {...this.makeWrapperProps({ className: "brz-shopify-email-marketing" })}
      >
        {this.renderCMWidget(widgetType, embededCode)}
      </Wrapper>
    );
  }
}
