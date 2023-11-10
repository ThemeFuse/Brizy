import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";

export class SealSubscription extends EditorComponent<ElementModel> {
  static get componentId(): "SealSubscription" {
    return "SealSubscription";
  }

  renderForEdit(): ReactNode {
    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-seal-subscription"
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
          className: "brz-shopify-seal-subscription"
        })}
      >
        <div
          {...makeDataAttr({
            name: "pf-type",
            value: "SealSubs"
          })}
        >
          <div
            className="sealsubs-target-element"
            {...makeDataAttr({
              name: "handle",
              value: makePlaceholder({
                content: "{{ product.handle }}"
              })
            })}
          />
        </div>
      </Wrapper>
    );
  }
}
