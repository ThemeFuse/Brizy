import React from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export type Value = ElementModel;

export class TrustProductRating extends EditorComponent<Value> {
  static get componentId(): "TrustProductRating" {
    return "TrustProductRating";
  }

  renderForEdit(): React.ReactNode {
    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <Wrapper
          {...this.makeWrapperProps({
            className: "brz-shopify-trust-product-rating"
          })}
        >
          {IS_PREVIEW ? (
            <div
              id="vnts_prodrating_wrp"
              className="vnts_prodreviews_wrp vnts_prodrating_wrp"
              data-product-id="{{ product.id }}"
            />
          ) : (
            <Placeholder icon="shopify" type="fa" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
