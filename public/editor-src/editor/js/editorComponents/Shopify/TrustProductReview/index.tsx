import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import Toolbar from "visual/component/Toolbar";
import { Wrapper } from "../../tools/Wrapper";
import * as toolbar from "./toolbar";
import * as sidebar from "./sidebar";
import Placeholder from "visual/component/Placeholder";
import { ElementModel } from "visual/component/Elements/Types";

export class TrustProductReview extends EditorComponent<ElementModel> {
  static get componentId(): "TrustProductReview" {
    return "TrustProductReview";
  }

  renderForEdit(): React.ReactNode {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-trust-product-review"
          })}
        >
          {IS_PREVIEW ? (
            //i'm not sure this will work, but you can check here  https://prnt.sc/DIkr8s5J8FJl
            <div>{`{% include "vntsr" %}`}</div>
          ) : (
            <Placeholder icon="shopify" type="fa" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
