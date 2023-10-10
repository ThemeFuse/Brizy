import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export class AppstleSubscription extends EditorComponent<ElementModel> {
  static get componentId(): "AppstleSubscription" {
    return "AppstleSubscription";
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-appstle-subscription"
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
        {...this.makeWrapperProps({
          className: "brz-shopify-appstle-subscription"
        })}
      >
        <span
          className="appstle_stand_alone_selector"
          data-product-data={makePlaceholder({
            content: "{{ product | json | escape }}"
          })}
          data-pf-type="AppstleSubs"
        />
      </Wrapper>
    );
  }
}
