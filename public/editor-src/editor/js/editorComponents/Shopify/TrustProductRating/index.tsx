import React from "react";
import { ElementModel } from "visual/component/Elements/Types";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Wrapper } from "../../tools/Wrapper";
import * as sidebar from "./sidebar";
import * as toolbar from "./toolbar";

export type Value = ElementModel;

export class TrustProductRating extends EditorComponent<Value> {
  static get componentId(): "TrustProductRating" {
    return "TrustProductRating";
  }

  renderForEdit(): React.ReactNode {
    const productId = makePlaceholder({ content: "{{ product.id }}" });

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
              {...makeDataAttr({
                name: "product-id",
                value: productId
              })}
            />
          ) : (
            <Placeholder icon="shopify" type="fa" />
          )}
        </Wrapper>
      </Toolbar>
    );
  }
}
